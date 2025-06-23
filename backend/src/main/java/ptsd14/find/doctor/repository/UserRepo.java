package ptsd14.find.doctor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import ptsd14.find.doctor.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

