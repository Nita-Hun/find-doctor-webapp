package ptsd14.find.doctor.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Streamable<AppointmentDto> findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime now);
    List<Appointment> findByPaymentIsNull();
    
    @Query("""
        SELECT a FROM Appointment a
        JOIN a.doctor d
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(d.firstname) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(d.lastname) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Appointment> findByDoctorNameContainingIgnoreCase(@Param("search") String search, Pageable pageable);
    Page<Appointment> findByPatientFirstnameContainingIgnoreCaseOrPatientLastnameContainingIgnoreCase(String search,
             String search2, Pageable pageable);


    // Dashboard 
    List<Appointment> findByDateTimeBetweenOrderByDateTimeAsc(LocalDateTime startDateTime, LocalDateTime endDateTime);
    List<Appointment> findTop5ByOrderByDateTimeDesc();

    @Query("""
    SELECT a
    FROM Appointment a
    JOIN FETCH a.patient
    JOIN FETCH a.doctor
    JOIN FETCH a.appointmentType
    WHERE a.dateTime > :now
    ORDER BY a.dateTime ASC
    """)
    List<Appointment> findTop5Upcoming(@Param("now") LocalDateTime now);

        
}
