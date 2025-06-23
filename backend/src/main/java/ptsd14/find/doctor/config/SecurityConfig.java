package ptsd14.find.doctor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**", "/api/doctors/**", "/api/hospitals/**", "/api/specializations/**"
        ,"/api/appointment-types/**").permitAll() // ✅ allow register/login
        .anyRequest().authenticated()
        .and())
        .httpBasic(); // or .formLogin(), or use JWT

    return http.build();
}

}

