package ptsd14.find.doctor.mapper;

import java.time.LocalDateTime;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.model.Hospital;

@Mapper(componentModel = "spring")
public interface HospitalMapper {
    HospitalDto toDto(Hospital hospital);
    Hospital toEntity(HospitalDto dto);

    @Mapping(target = "id", ignore = true) // Prevent ID override
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromDto(HospitalDto dto, @MappingTarget Hospital entity);

    @AfterMapping
    default void handleTimestamps(@MappingTarget AppointmentType entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }
}