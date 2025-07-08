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
    Page<Doctor> findBy(Pageable pageable);
    Page<Doctor> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
        String firstname,
        String lastname,
        Pageable pageable
    );
    Page<Doctor> findByStatusIgnoreCaseAndFirstnameContainingIgnoreCaseOrStatusIgnoreCaseAndLastnameContainingIgnoreCase(
            String trimmedStatus, String trimmedSearch, String trimmedStatus2, String trimmedSearch2,
            Pageable pageable);
    Page<Doctor> findByStatusIgnoreCase(String trim, Pageable pageable);

}

