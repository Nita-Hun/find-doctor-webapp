package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.model.Doctor;
import ptsd14.find.doctor.model.Hospital;
import ptsd14.find.doctor.model.Specialization;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-07T15:48:50+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class DoctorMapperImpl implements DoctorMapper {

    @Override
    public DoctorDto toDto(Doctor doctor) {
        if ( doctor == null ) {
            return null;
        }

        DoctorDto doctorDto = new DoctorDto();

        doctorDto.setSpecializationId( doctorSpecializationId( doctor ) );
        doctorDto.setSpecializationName( doctorSpecializationName( doctor ) );
        doctorDto.setHospitalId( doctorHospitalId( doctor ) );
        doctorDto.setHospitalName( doctorHospitalName( doctor ) );
        doctorDto.setCreatedAt( doctor.getCreatedAt() );
        doctorDto.setFirstname( doctor.getFirstname() );
        doctorDto.setId( doctor.getId() );
        doctorDto.setLastname( doctor.getLastname() );
        doctorDto.setStatus( doctor.getStatus() );
        doctorDto.setUpdatedAt( doctor.getUpdatedAt() );

        return doctorDto;
    }

    @Override
    public Doctor toEntity(DoctorDto doctorDto) {
        if ( doctorDto == null ) {
            return null;
        }

        Doctor doctor = new Doctor();

        doctor.setFirstname( doctorDto.getFirstname() );
        doctor.setId( doctorDto.getId() );
        doctor.setLastname( doctorDto.getLastname() );
        doctor.setStatus( doctorDto.getStatus() );

        return doctor;
    }

    @Override
    public void updateFromDto(DoctorDto dto, Doctor entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getFirstname() != null ) {
            entity.setFirstname( dto.getFirstname() );
        }
        if ( dto.getLastname() != null ) {
            entity.setLastname( dto.getLastname() );
        }
        if ( dto.getStatus() != null ) {
            entity.setStatus( dto.getStatus() );
        }
    }

    private Long doctorSpecializationId(Doctor doctor) {
        if ( doctor == null ) {
            return null;
        }
        Specialization specialization = doctor.getSpecialization();
        if ( specialization == null ) {
            return null;
        }
        Long id = specialization.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String doctorSpecializationName(Doctor doctor) {
        if ( doctor == null ) {
            return null;
        }
        Specialization specialization = doctor.getSpecialization();
        if ( specialization == null ) {
            return null;
        }
        String name = specialization.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long doctorHospitalId(Doctor doctor) {
        if ( doctor == null ) {
            return null;
        }
        Hospital hospital = doctor.getHospital();
        if ( hospital == null ) {
            return null;
        }
        Long id = hospital.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String doctorHospitalName(Doctor doctor) {
        if ( doctor == null ) {
            return null;
        }
        Hospital hospital = doctor.getHospital();
        if ( hospital == null ) {
            return null;
        }
        String name = hospital.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
