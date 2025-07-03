package ptsd14.find.doctor.mapper;

import java.time.LocalDateTime;

import org.mapstruct.*;
import ptsd14.find.doctor.dto.AppointmentTypeDto;
import ptsd14.find.doctor.model.AppointmentType;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AppointmentTypeMapper {

    // Convert Entity to DTO - only map id, name, price
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "price", source = "price")
    AppointmentTypeDto toDto(AppointmentType entity);

    // Convert DTO to Entity - ignore appointments and timestamps
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AppointmentType toEntity(AppointmentTypeDto dto);

    // Update Entity from DTO - ignore ID, appointments and timestamps
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromDto(AppointmentTypeDto dto, @MappingTarget AppointmentType entity);

    // Optional: AfterMapping hook to handle timestamps when creating new entities
    @AfterMapping
    default void handleTimestamps(@MappingTarget AppointmentType entity) {
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
    }
}