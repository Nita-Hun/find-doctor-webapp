package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.FeedbackDto;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.Feedback;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-18T17:33:48+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class FeedbackMapperImpl implements FeedbackMapper {

    @Override
    public FeedbackDto toDto(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }

        FeedbackDto feedbackDto = new FeedbackDto();

        feedbackDto.setAppointmentId( feedbackAppointmentId( feedback ) );
        feedbackDto.setComment( feedback.getComment() );
        feedbackDto.setCreatedAt( feedback.getCreatedAt() );
        feedbackDto.setId( feedback.getId() );
        feedbackDto.setRating( feedback.getRating() );
        feedbackDto.setUpdatedAt( feedback.getUpdatedAt() );

        return feedbackDto;
    }

    @Override
    public Feedback toEntity(FeedbackDto feedbackDto) {
        if ( feedbackDto == null ) {
            return null;
        }

        Feedback feedback = new Feedback();

        feedback.setComment( feedbackDto.getComment() );
        feedback.setId( feedbackDto.getId() );
        feedback.setRating( feedbackDto.getRating() );

        feedback.setAppointment( mapAppointment(feedbackDto.getAppointmentId()) );

        return feedback;
    }

    @Override
    public void updateFromDto(FeedbackDto dto, Feedback feedback) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getComment() != null ) {
            feedback.setComment( dto.getComment() );
        }
        if ( dto.getRating() != null ) {
            feedback.setRating( dto.getRating() );
        }
    }

    private Long feedbackAppointmentId(Feedback feedback) {
        if ( feedback == null ) {
            return null;
        }
        Appointment appointment = feedback.getAppointment();
        if ( appointment == null ) {
            return null;
        }
        Long id = appointment.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
