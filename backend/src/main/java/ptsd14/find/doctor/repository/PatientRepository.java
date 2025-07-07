package ptsd14.find.doctor.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import ptsd14.find.doctor.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{

    Page<Patient> findByStatusIgnoreCaseAndFirstnameContainingIgnoreCaseOrStatusIgnoreCaseAndLastnameContainingIgnoreCase(
            String trimmedStatus, String trimmedSearch, String trimmedStatus2, String trimmedSearch2,
            Pageable pageable);

    Page<Patient> findByStatusIgnoreCase(String trim, Pageable pageable);

    Page<Patient> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(String trimmed, String trimmed2,
            Pageable pageable);

    Page<Patient> findBy(Pageable pageable);
    
}
