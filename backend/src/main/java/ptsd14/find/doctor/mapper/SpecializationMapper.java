package ptsd14.find.doctor.mapper;

import java.time.LocalDateTime;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.model.Specialization;

@Mapper(componentModel = "spring")
public interface SpecializationMapper {
    SpecializationDto toDto(Specialization entity);
    Specialization toEntity(SpecializationDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDto(SpecializationDto dto, @MappingTarget Specialization entity);

    @AfterMapping
    default void handleTimestamps(@MappingTarget AppointmentType entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }
}