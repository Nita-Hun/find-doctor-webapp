package ptsd14.find.doctor.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.AppointmentTypeDto;
import ptsd14.find.doctor.exception.DuplicateResourceException;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.AppointmentTypeMapper;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.repository.AppointmentTypeRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentTypeService {

    private final AppointmentTypeRepository appointmentTypeRepository;
    private final AppointmentTypeMapper appointmentTypeMapper;

    public Optional<AppointmentTypeDto> getById(Long id) {
        return appointmentTypeRepository.findById(id)
                .map(appointmentTypeMapper::toDto);
    }

    public List<AppointmentTypeDto> findAll() {
        return appointmentTypeRepository.findAll().stream()
                .map(appointmentTypeMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentTypeDto create(AppointmentTypeDto dto) {
        validateNameUniqueness(dto.getName(), null);
        
        AppointmentType appointmentType = appointmentTypeMapper.toEntity(dto);
        appointmentType.setId(null); // Ensure new entity
        AppointmentType saved = appointmentTypeRepository.save(appointmentType);
        return appointmentTypeMapper.toDto(saved);
    }

    public AppointmentTypeDto update(Long id, AppointmentTypeDto dto) {
        AppointmentType existing = appointmentTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppointmentType not found"));

        // Only validate if name is being changed
        if (dto.getName() != null && !dto.getName().equals(existing.getName())) {
            validateNameUniqueness(dto.getName(), id);
            existing.setName(dto.getName());
        }

        if (dto.getPrice() != null) {
            existing.setPrice(dto.getPrice());
        }

        AppointmentType updated = appointmentTypeRepository.save(existing);
        return appointmentTypeMapper.toDto(updated);
    }

    public void delete(Long id) {
        if (!appointmentTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("AppointmentType not found");
        }
        appointmentTypeRepository.deleteById(id);
    }

    public boolean isNameUnique(String name, Long excludeId) {
        if (excludeId == null) {
            return !appointmentTypeRepository.existsByName(name);
        }
        return !appointmentTypeRepository.existsByNameAndIdNot(name, excludeId);
    }

    private void validateNameUniqueness(String name, Long excludeId) {
        if (!isNameUnique(name, excludeId)) {
            throw new DuplicateResourceException(
                String.format("Appointment type with name '%s' already exists", name)
            );
        }
    }

    // Additional repository query methods
    public boolean existsByName(String name) {
        return appointmentTypeRepository.existsByName(name);
    }

    public boolean existsByNameAndIdNot(String name, Long id) {
        return appointmentTypeRepository.existsByNameAndIdNot(name, id);
    }
}