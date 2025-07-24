package ptsd14.find.doctor.mapper;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.RoleDto;
import ptsd14.find.doctor.dto.RoleFormDto;
import ptsd14.find.doctor.model.UserRole;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-24T21:16:11+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class UserRoleMapperImpl implements UserRoleMapper {

    @Override
    public RoleDto toDto(UserRole role) {
        if ( role == null ) {
            return null;
        }

        RoleDto.RoleDtoBuilder roleDto = RoleDto.builder();

        roleDto.createdAt( role.getCreatedAt() );
        roleDto.description( role.getDescription() );
        roleDto.id( role.getId() );
        roleDto.name( role.getName() );
        Set<String> set = role.getPermissions();
        if ( set != null ) {
            roleDto.permissions( new LinkedHashSet<String>( set ) );
        }
        roleDto.status( role.getStatus() );
        roleDto.updatedAt( role.getUpdatedAt() );

        return roleDto.build();
    }

    @Override
    public UserRole toEntity(RoleFormDto formDto) {
        if ( formDto == null ) {
            return null;
        }

        UserRole userRole = new UserRole();

        userRole.setDescription( formDto.getDescription() );
        userRole.setName( formDto.getName() );
        Set<String> set = formDto.getPermissions();
        if ( set != null ) {
            userRole.setPermissions( new LinkedHashSet<String>( set ) );
        }
        userRole.setStatus( formDto.getStatus() );

        return userRole;
    }

    @Override
    public void updateFromFormDto(RoleFormDto formDto, UserRole role) {
        if ( formDto == null ) {
            return;
        }

        role.setDescription( formDto.getDescription() );
        role.setName( formDto.getName() );
        if ( role.getPermissions() != null ) {
            Set<String> set = formDto.getPermissions();
            if ( set != null ) {
                role.getPermissions().clear();
                role.getPermissions().addAll( set );
            }
            else {
                role.setPermissions( null );
            }
        }
        else {
            Set<String> set = formDto.getPermissions();
            if ( set != null ) {
                role.setPermissions( new LinkedHashSet<String>( set ) );
            }
        }
        role.setStatus( formDto.getStatus() );
    }
}
