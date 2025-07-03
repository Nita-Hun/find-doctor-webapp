package ptsd14.find.doctor.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.exception.DuplicateResourceException;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.SpecializationMapper;
import ptsd14.find.doctor.model.Specialization;
import ptsd14.find.doctor.repository.SpecializationRepos;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecializationService {

    private final SpecializationRepos specializationRepository;
    private final SpecializationMapper specializationMapper;


    public Optional<SpecializationDto> getById(Long id) {
        return specializationRepository.findById(id)
                .map(specializationMapper::toDto);
        
    }
    public List<SpecializationDto> findAll() {
        return specializationRepository.findAll().stream()
                .map(specializationMapper::toDto)
                .collect(Collectors.toList());
    }

    public SpecializationDto create(SpecializationDto dto) {
        validateNameUniqueness(dto.getName(), null);

        Specialization specialization = specializationMapper.toEntity(dto);
        specialization.setId(null); // Ensure new entity
        Specialization saved = specializationRepository.save(specialization);
        return specializationMapper.toDto(saved);
    }

    private void validateNameUniqueness(String name, Long excludeId) {
    if (!isNameUnique(name, excludeId)) {
        throw new DuplicateResourceException(String.format("%s already exists", name));
    }
}

    public boolean isNameUnique(String name, Long excludeId) {
       if(excludeId == null) {
           return !specializationRepository.existsByName(name);
       } else {
           return !specializationRepository.existsByNameAndIdNot(name, excludeId);
       }
    }
    public SpecializationDto update(Long id, SpecializationDto dto) {
        Specialization existing = specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found"));

        // Update fields
        if (dto.getName() != null && !dto.getName().equals(existing.getName())) {
            validateNameUniqueness(dto.getName(), id);
            existing.setName(dto.getName());
        }

        Specialization updatedSpecialization = specializationRepository.save(existing);
        return specializationMapper.toDto(updatedSpecialization);
    }

    public void delete(Long id) {
        if (!specializationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Specialization not found");
        }
        specializationRepository.deleteById(id);
    }
}