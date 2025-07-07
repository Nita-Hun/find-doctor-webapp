package ptsd14.find.doctor.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
    boolean existsByEmail(String email);
    Page<User> findByEmailContainingIgnoreCase(String trimmed, String trimmed2, Pageable pageable);
    Page<User> findBy(Pageable pageable);
    Page<User> findByRoleAndEmailContainingIgnoreCase(Role role, String trim, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);
    Page<User> findByEmailContainingIgnoreCase(String trim, Pageable pageable);
}

