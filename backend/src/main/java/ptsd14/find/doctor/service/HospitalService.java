package ptsd14.find.doctor.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.exception.DuplicateResourceException;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.HospitalMapper;
import ptsd14.find.doctor.model.Hospital;
import ptsd14.find.doctor.repository.HospitalRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final HospitalMapper hospitalMapper;

    public Optional<HospitalDto> getById(Long id) {
        return hospitalRepository.findById(id)
                .map(hospitalMapper::toDto);
    }
    
    public List<HospitalDto> findAll() {
        return hospitalRepository.findAll().stream()
                .map(hospitalMapper::toDto)
                .collect(Collectors.toList());
    }

    public HospitalDto create(HospitalDto dto) {
        validateNameUniqueness(dto.getName(), null);
        Hospital hospital = hospitalMapper.toEntity(dto);
        hospital.setId(null); // Ensure new entity
        Hospital savedHospital = hospitalRepository.save(hospital);
        return hospitalMapper.toDto(savedHospital);
    }

    private void validateNameUniqueness(String name, Long excludeId) {
        if(!isNameUnique(name, excludeId)) {  // Changed this condition
            throw new DuplicateResourceException(String.format("Hospital with name %s already exists", name));
        }
    }

    public boolean isNameUnique(String name, Long excludeId) {
        if(excludeId == null) {
            return !hospitalRepository.existsByName(name);  // Inverted logic
        }
        return !hospitalRepository.existsByNameAndIdNot(name, excludeId);  // Inverted logic
    }

    public HospitalDto update(Long id, HospitalDto dto) {
        Hospital existingHospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));

        // Only validate name uniqueness if the name is being changed
        if (dto.getName() != null && !dto.getName().equals(existingHospital.getName())) {
            validateNameUniqueness(dto.getName(), id);
            existingHospital.setName(dto.getName());
        }
        if (dto.getAddress() != null) {
            existingHospital.setAddress(dto.getAddress());
        }
        if (dto.getPhone() != null) {
            existingHospital.setPhone(dto.getPhone());
        }
        Hospital updatedHospital = hospitalRepository.save(existingHospital);
        return hospitalMapper.toDto(updatedHospital);
    }

    public void delete(Long id) {
        if (!hospitalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hospital not found");
        }
        hospitalRepository.deleteById(id);
    }
}