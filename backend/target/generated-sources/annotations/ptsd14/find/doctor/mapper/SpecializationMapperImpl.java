package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.model.Specialization;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-07T15:48:50+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class SpecializationMapperImpl implements SpecializationMapper {

    @Override
    public SpecializationDto toDto(Specialization entity) {
        if ( entity == null ) {
            return null;
        }

        SpecializationDto specializationDto = new SpecializationDto();

        specializationDto.setCreatedAt( entity.getCreatedAt() );
        specializationDto.setId( entity.getId() );
        specializationDto.setName( entity.getName() );
        specializationDto.setUpdatedAt( entity.getUpdatedAt() );

        return specializationDto;
    }

    @Override
    public Specialization toEntity(SpecializationDto dto) {
        if ( dto == null ) {
            return null;
        }

        Specialization specialization = new Specialization();

        specialization.setCreatedAt( dto.getCreatedAt() );
        specialization.setId( dto.getId() );
        specialization.setName( dto.getName() );
        specialization.setUpdatedAt( dto.getUpdatedAt() );

        return specialization;
    }

    @Override
    public void updateFromDto(SpecializationDto dto, Specialization entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getName() != null ) {
            entity.setName( dto.getName() );
        }
    }
}
