package ptsd14.find.doctor.mapper;

import org.mapstruct.MappingTarget;
import org.springframework.aot.generate.Generated;
import org.springframework.stereotype.Component;

import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.model.Specialization;


// This will be auto-generated in target/generated-sources/annotations/
@Generated
@Component
public class SpecializationMapperImpl implements SpecializationMapper {
    
    @Override
    public SpecializationDto toDto(Specialization entity) {
        if (entity == null) {
            return null;
        }
        
        SpecializationDto dto = new SpecializationDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }

    @Override
    public Specialization toEntity(SpecializationDto dto) {
        if (dto == null) {
            return null;
        }
        
        Specialization entity = new Specialization();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }

    @Override
    public void updateFromDto(SpecializationDto dto, @MappingTarget Specialization entity) {
        if (dto == null) {
            return;
        }
        
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
    }
}
