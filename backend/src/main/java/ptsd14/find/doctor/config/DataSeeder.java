package ptsd14.find.doctor.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;
import ptsd14.find.doctor.repository.UserRepo;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seed() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("adminpass"));
            admin.setRole(Role.valueOf("ADMIN".toUpperCase()));
            userRepository.save(admin);

            User doctor = new User();
            doctor.setEmail("doctor@example.com");
            doctor.setPassword(passwordEncoder.encode("doctorpass"));
            doctor.setRole(Role.valueOf("DOCTOR".toUpperCase()));

            userRepository.save(doctor);

            User patient = new User();
            patient.setEmail("patient@example.com");
            patient.setPassword(passwordEncoder.encode("patientpass"));
            patient.setRole(Role.valueOf("PATIENT".toUpperCase()));

            userRepository.save(patient);
        }
    }
}

