package ptsd14.find.doctor.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ptsd14.find.doctor.dto.FeedbackDto;
import ptsd14.find.doctor.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Page<FeedbackDto> findAllByAppointmentId(Long appointmentId, Pageable pageable);

    List<Feedback> findByAppointment_Doctor_Id(Long id);

    Page<Feedback> findByRatingAndCommentContainingIgnoreCase(Integer rating, String trim, Pageable pageable);

    Page<Feedback> findByRating(Integer rating, Pageable pageable);

    Page<Feedback> findByCommentContainingIgnoreCase(String trim, Pageable pageable);

  
    
}
