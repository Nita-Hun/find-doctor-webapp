package ptsd14.find.doctor.mapper;

import org.mapstruct.*;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.model.User;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity -> DTO
    @Mapping(target = "role", expression = "java(user.getRole() != null ? user.getRole().name() : null)")
    @Mapping(target = "createdAt", expression = "java(formatDateTime(user.getCreatedAt()))")
    @Mapping(target = "updatedAt", expression = "java(formatDateTime(user.getUpdatedAt()))")
    UserDto toDto(User user);

    // DTO -> Entity
    @Mapping(target = "role", expression = "java(dto.getRole() != null ? Role.valueOf(dto.getRole()) : null)")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true) // Typically not mapped from DTO
    @Mapping(target = "authorities", ignore = true) // Ignore 'authorities' when mapping from DTO to entity
    User toEntity(UserDto dto);

    // Update existing entity from DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "authorities", ignore = true) // Ignore 'authorities' when updating entity from DTO
    void updateFromDto(UserDto dto, @MappingTarget User user);

    // Helper method to safely format date
    default String formatDateTime(LocalDateTime time) {
        return time != null ? time.toString() : null;
    }
}
