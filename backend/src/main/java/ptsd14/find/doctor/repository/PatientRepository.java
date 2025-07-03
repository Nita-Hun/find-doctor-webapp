package ptsd14.find.doctor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ptsd14.find.doctor.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{
    
}
