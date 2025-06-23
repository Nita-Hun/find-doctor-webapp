package ptsd14.find.doctor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.model.Hospital;

@Mapper(componentModel = "spring")
public interface HospitalMapper {
    HospitalDto toDto(Hospital hospital);
    Hospital toEntity(HospitalDto dto);

    @Mapping(target = "id", ignore = true) // Prevent ID override
    void updateFromDto(HospitalDto dto, @MappingTarget Hospital entity);
}
