package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ptsd14.find.doctor.dto.CreateUserRequest;
import ptsd14.find.doctor.dto.UpdateUserRequest;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.UserMapper;
import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;
import ptsd14.find.doctor.repository.UserRepo;

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

    public UserDto updateUser(Long id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(req.getEmail());
        user.setRole(Role.valueOf(req.getRole()));
        user.setProfilePhotoUrl(req.getProfilePhotoUrl());

        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        User updated = userRepository.save(user);
        return userMapper.toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
