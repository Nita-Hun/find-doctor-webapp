package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.AppointmentTypeDto;
import ptsd14.find.doctor.model.AppointmentType;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-24T21:26:46+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class AppointmentTypeMapperImpl implements AppointmentTypeMapper {

    @Override
    public AppointmentTypeDto toDto(AppointmentType entity) {
        if ( entity == null ) {
            return null;
        }

        AppointmentTypeDto appointmentTypeDto = new AppointmentTypeDto();

        appointmentTypeDto.setCreatedAt( entity.getCreatedAt() );
        appointmentTypeDto.setDuration( entity.getDuration() );
        appointmentTypeDto.setId( entity.getId() );
        appointmentTypeDto.setName( entity.getName() );
        appointmentTypeDto.setPrice( entity.getPrice() );
        appointmentTypeDto.setUpdatedAt( entity.getUpdatedAt() );

        return appointmentTypeDto;
    }

    @Override
    public AppointmentType toEntity(AppointmentTypeDto dto) {
        if ( dto == null ) {
            return null;
        }

        AppointmentType appointmentType = new AppointmentType();

        appointmentType.setDuration( dto.getDuration() );
        appointmentType.setName( dto.getName() );
        appointmentType.setPrice( dto.getPrice() );

        return appointmentType;
    }

    @Override
    public void updateFromDto(AppointmentTypeDto dto, AppointmentType entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getDuration() != null ) {
            entity.setDuration( dto.getDuration() );
        }
        if ( dto.getName() != null ) {
            entity.setName( dto.getName() );
        }
        if ( dto.getPrice() != null ) {
            entity.setPrice( dto.getPrice() );
        }
    }
}
