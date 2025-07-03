package ptsd14.find.doctor.mapper;

import java.time.LocalDateTime;

import org.mapstruct.*;
import ptsd14.find.doctor.dto.FeedbackDto;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.model.Feedback;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface FeedbackMapper {

    @Mapping(target = "appointmentId", source = "appointment.id")
    FeedbackDto toDto(Feedback feedback);

    @Mapping(target = "appointment", expression = "java(mapAppointment(feedbackDto.getAppointmentId()))")
    Feedback toEntity(FeedbackDto feedbackDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appointment", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromDto(FeedbackDto dto, @MappingTarget Feedback feedback);

    // Helper method to create a minimal Appointment object using the ID
    default Appointment mapAppointment(Long id) {
        if (id == null) return null;
        Appointment appointment = new Appointment();
        appointment.setId(id);
        return appointment;

    }
    @AfterMapping
    default void handleTimestamps(@MappingTarget AppointmentType entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }
}
