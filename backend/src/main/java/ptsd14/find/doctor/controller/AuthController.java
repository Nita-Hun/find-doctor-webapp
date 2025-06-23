package ptsd14.find.doctor.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.service.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");
            userService.registerUser(name, email, password);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        return userService.validateLogin(email, password)
            .map(user -> ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", Map.of("id", user.getId(), "name", user.getName(), "role", user.getRole())
            )))
            .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid email or password")));
    }
}

