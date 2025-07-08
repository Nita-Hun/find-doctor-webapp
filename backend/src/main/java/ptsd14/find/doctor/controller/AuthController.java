package ptsd14.find.doctor.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.core.AuthenticationException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.LoginRequest;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.dto.RegisterRequest;
import ptsd14.find.doctor.dto.UpdateProfileRequest;
import ptsd14.find.doctor.jwt.JwtUtil;
import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;
import ptsd14.find.doctor.repository.UserRepo;
import ptsd14.find.doctor.service.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminDashboard() {
        return "Admin content";
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public String doctorDashboard() {
        return "Doctor content";
    }
    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public String patientDashboard() {
        return "Patient content";
    }
    

    // New endpoint to get current authenticated user info
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Convert createdAt and updatedAt to String if they exist
        String createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : null;
        String updatedAt = user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null;

        UserDto userDto = new UserDto(
            user.getId(),
            user.getEmail(),
            user.getRole() != null ? user.getRole().name() : null,
            user.getProfilePhotoUrl(),
            createdAt,
            updatedAt
        );

        return ResponseEntity.ok(userDto);
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already taken");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProfilePhotoUrl("/uploads/default-profile.png");

        try {
            user.setRole(Role.valueOf(request.getRole()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " + request.getRole());
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            // Return 401 Unauthorized with message
            Map<String, String> error = Map.of("error", "Invalid email or password");
            return ResponseEntity.status(401).body(error);
        }

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        String dashboardUrl = switch(user.getRole()) {
            case ADMIN -> "/admin/dashboards";
            case DOCTOR -> "/doctor/dashboards";
            case PATIENT -> "/patient/dashboards";
        };

        UserDto userDto = new UserDto(
            user.getId(),
            user.getEmail(),
            user.getRole() != null ? user.getRole().name() : null,
            user.getProfilePhotoUrl(),
            user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
            user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null
        );

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", token);
        response.put("dashboardUrl", dashboardUrl);
        response.put("user", userDto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-profile-photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        if (!file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Invalid file type");
        }
        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File too large (max 2MB)");
        }

        try {
            String basePath = System.getProperty("user.dir");
            Path uploadDir = Paths.get(basePath, "uploads", "profile-photos");
            Files.createDirectories(uploadDir);

            // Delete old photo if exists and is not the default photo
            String oldPhotoUrl = user.getProfilePhotoUrl();
            if (oldPhotoUrl != null && !oldPhotoUrl.equals("/uploads/default-profile.png")) {
                Path oldPhotoPath = Paths.get(basePath, oldPhotoUrl.replaceFirst("/", ""));
                try {
                    Files.deleteIfExists(oldPhotoPath);
                } catch (Exception ex) {
                    // Log warning, but do not fail the whole request
                    System.err.println("Failed to delete old profile photo: " + ex.getMessage());
                }
            }

            // Save new photo
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path filepath = uploadDir.resolve(filename);
            file.transferTo(filepath.toFile());

            // Update user's profilePhotoUrl
            user.setProfilePhotoUrl("/uploads/profile-photos/" + filename);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("profilePhotoUrl", user.getProfilePhotoUrl()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }


    @PutMapping("/update-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String oldEmail = auth.getName();

        UserDto updatedUser = userService.updateProfile(oldEmail, request);

        // Generate new token with updated email/role if changed
        String newToken = jwtUtil.generateToken(updatedUser.getEmail(), updatedUser.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated");
        response.put("user", updatedUser);
        response.put("accessToken", newToken);

        return ResponseEntity.ok(response);
    }




}
