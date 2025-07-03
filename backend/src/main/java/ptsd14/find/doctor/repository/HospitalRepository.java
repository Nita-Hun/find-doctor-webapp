package ptsd14.find.doctor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptsd14.find.doctor.model.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long>{

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    Optional<Hospital> findById(Long id);
    
}
