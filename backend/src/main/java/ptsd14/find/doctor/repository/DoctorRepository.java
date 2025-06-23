package ptsd14.find.doctor.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ptsd14.find.doctor.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @EntityGraph(attributePaths = {"hospital", "specialization"})
    Page<Doctor> findAll(Pageable pageable);
}
