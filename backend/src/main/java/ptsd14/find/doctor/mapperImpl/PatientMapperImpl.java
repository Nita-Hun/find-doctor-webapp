package ptsd14.find.doctor.mapperImpl;

import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.PatientDto;
import ptsd14.find.doctor.mapper.PatientMapper;
import ptsd14.find.doctor.model.Patient;

@Component
public class PatientMapperImpl implements PatientMapper {

    @Override
    public PatientDto toDto(Patient patient) {
        if (patient == null) {
            return null;
        }

        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setFirstname(patient.getFirstname());
        dto.setLastname(patient.getLastname());
        dto.setStatus(patient.getStatus());
        dto.setGender(patient.getGender());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setAddress(patient.getAddress());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setUpdatedAt(patient.getUpdatedAt());
        return dto;
    }

    @Override
    public Patient toEntity(PatientDto dto) {
        if (dto == null) {
            return null;
        }

        Patient patient = new Patient();
        patient.setId(dto.getId());
        patient.setFirstname(dto.getFirstname());
        patient.setLastname(dto.getLastname());
        patient.setStatus(dto.getStatus());
        patient.setGender(dto.getGender());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setAddress(dto.getAddress());
        return patient;
    }

    @Override
    public void updateFromDto(PatientDto dto, Patient entity) {
        if (dto == null || entity == null) {
            return;
        }

        if (dto.getFirstname() != null) {
            entity.setFirstname(dto.getFirstname());
        }
        if (dto.getLastname() != null) {
            entity.setLastname(dto.getLastname());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getGender() != null) {
            entity.setGender(dto.getGender());
        }
        if (dto.getDateOfBirth() != null) {
            entity.setDateOfBirth(dto.getDateOfBirth());
        }
        if (dto.getAddress() != null) {
            entity.setAddress(dto.getAddress());
        }
    }
}

