package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.PatientDto;
import ptsd14.find.doctor.model.Patient;
import ptsd14.find.doctor.model.User;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-24T21:26:46+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PatientMapperImpl implements PatientMapper {

    @Override
    public PatientDto toDto(Patient patient) {
        if ( patient == null ) {
            return null;
        }

        PatientDto patientDto = new PatientDto();

        patientDto.setUserId( patientUserId( patient ) );
        patientDto.setUserEmail( patientUserEmail( patient ) );
        patientDto.setAddress( patient.getAddress() );
        patientDto.setCreatedAt( patient.getCreatedAt() );
        patientDto.setDateOfBirth( patient.getDateOfBirth() );
        patientDto.setFirstname( patient.getFirstname() );
        patientDto.setGender( patient.getGender() );
        patientDto.setId( patient.getId() );
        patientDto.setLastname( patient.getLastname() );
        patientDto.setStatus( patient.getStatus() );
        patientDto.setUpdatedAt( patient.getUpdatedAt() );

        return patientDto;
    }

    @Override
    public Patient toEntity(PatientDto dto) {
        if ( dto == null ) {
            return null;
        }

        Patient patient = new Patient();

        patient.setAddress( dto.getAddress() );
        patient.setDateOfBirth( dto.getDateOfBirth() );
        patient.setFirstname( dto.getFirstname() );
        patient.setGender( dto.getGender() );
        patient.setId( dto.getId() );
        patient.setLastname( dto.getLastname() );
        patient.setStatus( dto.getStatus() );

        return patient;
    }

    @Override
    public void updateFromDto(PatientDto dto, Patient entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getAddress() != null ) {
            entity.setAddress( dto.getAddress() );
        }
        if ( dto.getDateOfBirth() != null ) {
            entity.setDateOfBirth( dto.getDateOfBirth() );
        }
        if ( dto.getFirstname() != null ) {
            entity.setFirstname( dto.getFirstname() );
        }
        if ( dto.getGender() != null ) {
            entity.setGender( dto.getGender() );
        }
        if ( dto.getLastname() != null ) {
            entity.setLastname( dto.getLastname() );
        }
        if ( dto.getStatus() != null ) {
            entity.setStatus( dto.getStatus() );
        }
    }

    private Long patientUserId(Patient patient) {
        if ( patient == null ) {
            return null;
        }
        User user = patient.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String patientUserEmail(Patient patient) {
        if ( patient == null ) {
            return null;
        }
        User user = patient.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }
}
