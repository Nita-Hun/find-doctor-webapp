package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ptsd14.find.doctor.dto.PatientDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.PatientMapper;
import ptsd14.find.doctor.model.Patient;
import ptsd14.find.doctor.repository.PatientRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    @Transactional(readOnly = true)
    public Page<PatientDto> getAll(Pageable pageable, String search, String status) {
        Page<Patient> patients;

        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasStatus = status != null && !status.trim().isEmpty();

        if (hasStatus && hasSearch) {
            // Search by name and filter by status
            String trimmedSearch = search.trim();
            String trimmedStatus = status.trim();
            patients = patientRepository.findByStatusIgnoreCaseAndFirstnameContainingIgnoreCaseOrStatusIgnoreCaseAndLastnameContainingIgnoreCase(
                trimmedStatus, trimmedSearch,
                trimmedStatus, trimmedSearch,
                pageable
            );
        } else if (hasStatus) {
            // Filter by status only
            patients = patientRepository.findByStatusIgnoreCase(status.trim(), pageable);
        } else if (hasSearch) {
            // Search by name only
            String trimmed = search.trim();
            patients = patientRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
                trimmed,
                trimmed,
                pageable
            );
        } else {
            // No filters
            patients = patientRepository.findBy(pageable);
        }

        return patients.map(patientMapper::toDto);
    }

     @Transactional(readOnly = true)
    public Optional<PatientDto> getById(Long id) {
        return patientRepository.findById(id)
                .map(patientMapper::toDto);
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

