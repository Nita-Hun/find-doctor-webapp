package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.UserDto;
import ptsd14.find.doctor.model.User;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-18T17:29:47+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250729-0351, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setProfilePhotoUrl( user.getProfilePhotoUrl() );
        userDto.setCreatedAt( user.getCreatedAt() );
        userDto.setEmail( user.getEmail() );
        userDto.setId( user.getId() );
        userDto.setUpdatedAt( user.getUpdatedAt() );

        userDto.setRoleId( user.getRole() != null ? user.getRole().getId() : null );
        userDto.setRole( user.getRole() != null ? user.getRole().getName() : null );

        return userDto;
    }

    @Override
    public User toEntity(UserDto dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setProfilePhotoUrl( dto.getProfilePhotoUrl() );
        user.setEmail( dto.getEmail() );
        user.setId( dto.getId() );

        return user;
    }

    @Override
    public void updateFromDto(UserDto dto, User user) {
        if ( dto == null ) {
            return;
        }

        user.setProfilePhotoUrl( dto.getProfilePhotoUrl() );
        user.setEmail( dto.getEmail() );
    }
}
