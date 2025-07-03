package ptsd14.find.doctor.mapper;

import java.time.LocalDateTime;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.AppointmentType;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "appointmentType.id", target = "appointmentTypeId")
    AppointmentDto toDto(Appointment appointment);

    @Mapping(target = "doctor.id", ignore = true)
    @Mapping(target = "patient.id", ignore = true)
    @Mapping(target = "appointmentType.id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Appointment toEntity(AppointmentDto dto);

    @AfterMapping
    default void handleTimestamps(@MappingTarget AppointmentType entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }
}
