package ptsd14.find.doctor.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;
import ptsd14.find.doctor.repository.UserRepo;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(String name, String email, String password) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.USER); // Default role

        userRepo.save(user);
    }

    public Optional<User> validateLogin(String email, String password) {
        return userRepo.findByEmail(email)
            .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }
}

