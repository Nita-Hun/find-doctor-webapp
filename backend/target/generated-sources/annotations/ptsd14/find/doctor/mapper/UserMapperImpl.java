package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.model.Role;
import ptsd14.find.doctor.model.User;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-07T15:48:50+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setEmail( user.getEmail() );
        userDto.setId( user.getId() );
        userDto.setProfilePhotoUrl( user.getProfilePhotoUrl() );

        userDto.setRole( user.getRole() != null ? user.getRole().name() : null );
        userDto.setCreatedAt( formatDateTime(user.getCreatedAt()) );
        userDto.setUpdatedAt( formatDateTime(user.getUpdatedAt()) );

        return userDto;
    }

    @Override
    public User toEntity(UserDto dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( dto.getEmail() );
        user.setId( dto.getId() );
        user.setProfilePhotoUrl( dto.getProfilePhotoUrl() );

        user.setRole( dto.getRole() != null ? Role.valueOf(dto.getRole()) : null );

        return user;
    }

    @Override
    public void updateFromDto(UserDto dto, User user) {
        if ( dto == null ) {
            return;
        }

        user.setEmail( dto.getEmail() );
        user.setProfilePhotoUrl( dto.getProfilePhotoUrl() );
        if ( dto.getRole() != null ) {
            user.setRole( Enum.valueOf( Role.class, dto.getRole() ) );
        }
        else {
            user.setRole( null );
        }
    }
}
