package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ptsd14.find.doctor.dto.CreateUserRequest;
import ptsd14.find.doctor.dto.UpdateProfileRequest;
import ptsd14.find.doctor.dto.UpdateUserRequest;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.UserMapper;
import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;
import ptsd14.find.doctor.repository.UserRepo;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserDto> getAll(Pageable pageable, String search, Role role) {
        Page<User> users;

        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasRole = role != null;

        if (hasRole && hasSearch) {
            users = userRepository.findByRoleAndEmailContainingIgnoreCase(
                role,
                search.trim(),
                pageable
            );
        } else if (hasRole) {
            users = userRepository.findByRole(
                role,
                pageable
            );
        } else if (hasSearch) {
            users = userRepository.findByEmailContainingIgnoreCase(
                search.trim(),
                pageable
            );
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(userMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<UserDto> getById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto);
    }

    public UserDto createUser(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.valueOf(req.getRole()));
        user.setProfilePhotoUrl(req.getProfilePhotoUrl());
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    private void deleteProfilePhotoFileIfExists(String profilePhotoUrl) {
        if (profilePhotoUrl == null || profilePhotoUrl.isBlank() || profilePhotoUrl.equals("/uploads/default-profile.png")) {
            return; // Nothing to delete or default image, so skip
        }

        String basePath = System.getProperty("user.dir");
        Path photoPath = Paths.get(basePath, profilePhotoUrl.replaceFirst("/", ""));

        try {
            Files.deleteIfExists(photoPath);
        } catch (Exception ex) {
            System.err.println("Failed to delete profile photo file: " + ex.getMessage());
            // optionally log with logger instead of System.err
        }
    }

    public UserDto updateUser(Long id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(req.getEmail());
        user.setRole(Role.valueOf(req.getRole()));

        if (req.getProfilePhotoUrl() != null && !req.getProfilePhotoUrl().isBlank()) {
            String oldPhotoUrl = user.getProfilePhotoUrl();
            if (!oldPhotoUrl.equals(req.getProfilePhotoUrl())) {
                deleteProfilePhotoFileIfExists(oldPhotoUrl);
                user.setProfilePhotoUrl(req.getProfilePhotoUrl());
            }
        }

        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        User updated = userRepository.save(user);
        return userMapper.toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        deleteProfilePhotoFileIfExists(user.getProfilePhotoUrl());

        userRepository.deleteById(id);
    }

    //Update Profile##############################################################
    @Transactional
    public UserDto updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(currentEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User saved = userRepository.save(user);

        return userMapper.toDto(saved);
    }


}
