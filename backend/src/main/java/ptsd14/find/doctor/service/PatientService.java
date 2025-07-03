package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ptsd14.find.doctor.dto.PatientDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.PatientMapper;
import ptsd14.find.doctor.model.Patient;
import ptsd14.find.doctor.repository.PatientRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public Optional<PatientDto> getById(Long id) {
        return patientRepository.findById(id).map(patientMapper::toDto);
    }

    public List<PatientDto> findAll() {
        return patientRepository.findAll().stream()
                .map(patientMapper::toDto)
                .collect(Collectors.toList());
    }

    public PatientDto create(PatientDto dto) {
        Patient patient = patientMapper.toEntity(dto);
        patient.setId(null);
        return patientMapper.toDto(patientRepository.save(patient));
    }

    public PatientDto update(Long id, PatientDto dto) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        patientMapper.updateFromDto(dto, existing);
        return patientMapper.toDto(patientRepository.save(existing));
    }

    public void delete(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found");
        }
        patientRepository.deleteById(id);
    }
}

