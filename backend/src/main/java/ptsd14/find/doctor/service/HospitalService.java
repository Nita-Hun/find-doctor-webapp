package ptsd14.find.doctor.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.mapper.HospitalMapper;
import ptsd14.find.doctor.model.Hospital;
import ptsd14.find.doctor.repository.HospitalRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final HospitalMapper hospitalMapper;


    public HospitalDto getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Hospital not found"));
        return hospitalMapper.toDto(hospital);
    } 
    
    public List<HospitalDto> findAll() {
        return hospitalRepository.findAll().stream()
                .map(hospitalMapper::toDto)
                .collect(Collectors.toList());
    }

    public HospitalDto findById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        return hospitalMapper.toDto(hospital);
    }

    public HospitalDto create(HospitalDto dto) {
        Hospital hospital = hospitalMapper.toEntity(dto);
        hospital.setId(null); // Ensure new entity
        Hospital savedHospital = hospitalRepository.save(hospital);
        return hospitalMapper.toDto(savedHospital);
    }

    public HospitalDto update(Long id, HospitalDto dto) {

        Hospital existingHospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));

        // Manually update fields to ensure proper mapping
        if (dto.getName() != null) {
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
            throw new IllegalArgumentException("Hospital not found");
        }
        hospitalRepository.deleteById(id);
    }
}