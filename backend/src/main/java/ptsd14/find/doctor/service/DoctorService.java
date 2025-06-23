package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.mapper.DoctorMapper;
import ptsd14.find.doctor.model.Doctor;
import ptsd14.find.doctor.model.Hospital;
import ptsd14.find.doctor.model.Specialization;
import ptsd14.find.doctor.repository.DoctorRepository;
import ptsd14.find.doctor.repository.HospitalRepository;
import ptsd14.find.doctor.repository.SpecializationRepos;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    private final HospitalRepository hospitalRepository;
    private final SpecializationRepos specializationRepository;

    public Page<DoctorDto> getAll(Pageable pageable) {
        return doctorRepository.findAll(pageable)
                .map(doctorMapper::toDto);
    }

    public Optional<DoctorDto> getById(Long id) {
        return doctorRepository.findById(id)
                .map(doctorMapper::toDto);
    }

    public DoctorDto create(DoctorDto dto) {
        Doctor doctor = doctorMapper.toEntity(dto);

        // Set hospital and specialization
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new RuntimeException("Specialization not found"));

        doctor.setHospital(hospital);
        doctor.setSpecialization(specialization);

        Doctor saved = doctorRepository.save(doctor);
        return doctorMapper.toDto(saved);
    }

    public DoctorDto update(Long id, DoctorDto dto) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        existing.setFirstname(dto.getFirstname());
        existing.setLastname(dto.getLastname());
        existing.setStatus(dto.getStatus());

        // Update hospital and specialization
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new RuntimeException("Specialization not found"));

        existing.setHospital(hospital);
        existing.setSpecialization(specialization);

        Doctor updated = doctorRepository.save(existing);
        return doctorMapper.toDto(updated);
    }

    public void delete(Long id) {
        doctorRepository.deleteById(id);
    }
}
