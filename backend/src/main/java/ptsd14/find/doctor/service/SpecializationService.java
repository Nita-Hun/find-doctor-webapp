package ptsd14.find.doctor.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.mapper.SpecializationMapper;
import ptsd14.find.doctor.model.Specialization;
import ptsd14.find.doctor.repository.SpecializationRepos;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecializationService {

    private final SpecializationRepos specializationRepository;
    private final SpecializationMapper specializationMapper;

    public List<SpecializationDto> findAll() {
        return specializationRepository.findAll().stream()
                .map(specializationMapper::toDto)
                .collect(Collectors.toList());
    }

    public SpecializationDto findById(Long id) {
        Specialization specialization = specializationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Specialization not found"));
        return specializationMapper.toDto(specialization);
    }

    public SpecializationDto create(SpecializationDto dto) {
        Specialization specialization = specializationMapper.toEntity(dto);
        specialization.setId(null); // Ensure new entity
        Specialization savedSpecialization = specializationRepository.save(specialization);
        return specializationMapper.toDto(savedSpecialization);
    }

    public SpecializationDto update(Long id, SpecializationDto dto) {
        // Verify ID consistency
        if (dto.getId() != null && !id.equals(dto.getId())) {
            throw new IllegalArgumentException("ID in path doesn't match ID in body");
        }

        Specialization existingSpecialization = specializationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Specialization not found"));

        // Update fields
        if (dto.getName() != null) {
            existingSpecialization.setName(dto.getName());
        }

        Specialization updatedSpecialization = specializationRepository.save(existingSpecialization);
        return specializationMapper.toDto(updatedSpecialization);
    }

    public void delete(Long id) {
        if (!specializationRepository.existsById(id)) {
            throw new IllegalArgumentException("Specialization not found");
        }
        specializationRepository.deleteById(id);
    }
}