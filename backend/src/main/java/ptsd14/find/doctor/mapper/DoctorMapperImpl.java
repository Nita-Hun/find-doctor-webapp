package ptsd14.find.doctor.mapper;


import org.springframework.aot.generate.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.model.Doctor;

@Generated
@Component
public class DoctorMapperImpl implements DoctorMapper {

    @Override
    public DoctorDto toDto(Doctor doctor) {
        if (doctor == null) {
            return null;
        }

        DoctorDto doctorDto = new DoctorDto();
        doctorDto.setId(doctor.getId());
        doctorDto.setFirstname(doctor.getFirstname());
        doctorDto.setLastname(doctor.getLastname());
        doctorDto.setStatus(doctor.getStatus());
        doctorDto.setCreatedAt(doctor.getCreatedAt());
        doctorDto.setUpdatedAt(doctor.getUpdatedAt());

        if (doctor.getHospital() != null) {
            doctorDto.setHospitalId(doctor.getHospital().getId());
            doctorDto.setHospitalName(doctor.getHospital().getName());
        }

        if (doctor.getSpecialization() != null) {
            doctorDto.setSpecializationId(doctor.getSpecialization().getId());
            doctorDto.setSpecializationName(doctor.getSpecialization().getName());
        }

        return doctorDto;
    }

    @Override
    public Doctor toEntity(DoctorDto doctorDto) {
        if (doctorDto == null) {
            return null;
        }

        Doctor doctor = new Doctor();
        doctor.setId(doctorDto.getId());
        doctor.setFirstname(doctorDto.getFirstname());
        doctor.setLastname(doctorDto.getLastname());
        doctor.setStatus(doctorDto.getStatus());
        // Note: Relationships are set in the service layer
        return doctor;
    }
}
