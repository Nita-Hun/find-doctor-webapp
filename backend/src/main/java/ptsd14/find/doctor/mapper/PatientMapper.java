package ptsd14.find.doctor.mapper;

import java.time.LocalDateTime;

import org.mapstruct.*;
import ptsd14.find.doctor.dto.PatientDto;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.model.Patient;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    PatientDto toDto(Patient patient);
    Patient toEntity(PatientDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromDto(PatientDto dto, @MappingTarget Patient entity);

    @AfterMapping
    default void handleTimestamps(@MappingTarget AppointmentType entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }
}
