package ptsd14.find.doctor.mapperImpl;

import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.FeedbackDto;
import ptsd14.find.doctor.mapper.FeedbackMapper;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.Feedback;

@Component
public class FeedbackMapperImpl implements FeedbackMapper {

    @Override
    public FeedbackDto toDto(Feedback feedback) {
        if (feedback == null) {
            return null;
        }

        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setUpdatedAt(feedback.getUpdatedAt());
        
        if (feedback.getAppointment() != null) {
            dto.setAppointmentId(feedback.getAppointment().getId());
        }

        return dto;
    }

    @Override
    public Feedback toEntity(FeedbackDto dto) {
        if (dto == null) {
            return null;
        }

        Feedback entity = new Feedback();
        entity.setId(dto.getId());
        entity.setRating(dto.getRating());
        entity.setComment(dto.getComment());

        if (dto.getAppointmentId() != null) {
            Appointment appointment = new Appointment();
            appointment.setId(dto.getAppointmentId());
            entity.setAppointment(appointment);
        }

        return entity;
    }

    @Override
    public void updateFromDto(FeedbackDto dto, Feedback feedback) {
        if (dto == null || feedback == null) {
            return;
        }

        if (dto.getRating() != null) {
            feedback.setRating(dto.getRating());
        }
        if (dto.getComment() != null) {
            feedback.setComment(dto.getComment());
        }
        // createdAt, updatedAt, and appointment are ignored as defined in the interface
    }

    @Override
    public Appointment mapAppointment(Long id) {
        if (id == null) {
            return null;
        }
        Appointment appointment = new Appointment();
        appointment.setId(id);
        return appointment;
    }
}