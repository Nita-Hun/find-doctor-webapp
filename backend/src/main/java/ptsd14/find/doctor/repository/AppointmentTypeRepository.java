package ptsd14.find.doctor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ptsd14.find.doctor.model.AppointmentType;

@Repository
public interface AppointmentTypeRepository extends JpaRepository<AppointmentType, Long>{
    
}
