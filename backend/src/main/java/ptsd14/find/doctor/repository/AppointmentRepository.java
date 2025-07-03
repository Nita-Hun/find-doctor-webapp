package ptsd14.find.doctor.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.util.Streamable;

import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findTop5ByDateTimeAfterOrderByDateTimeAsc(LocalDateTime now);
    Streamable<AppointmentDto> findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime now);
    
}
