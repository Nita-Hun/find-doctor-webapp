package ptsd14.find.doctor.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.AuthenticationException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.LoginRequest;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.dto.RegisterRequest;
import ptsd14.find.doctor.jwt.JwtUtil;
import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;
import ptsd14.find.doctor.repository.UserRepo;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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
}
