package ptsd14.find.doctor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.model.Doctor;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    
    @Mapping(target = "specializationId", source = "specialization.id")
    @Mapping(target = "specializationName", source = "specialization.name")
    @Mapping(target = "hospitalId", source = "hospital.id")
    @Mapping(target = "hospitalName", source = "hospital.name")
    DoctorDto toDto(Doctor doctor);

    @Mapping(target = "specialization", ignore = true)
    @Mapping(target = "hospital", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Doctor toEntity(DoctorDto doctorDto);
}