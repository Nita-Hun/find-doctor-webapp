package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.DoctorMapper;
import ptsd14.find.doctor.model.Doctor;
import ptsd14.find.doctor.model.Hospital;
import ptsd14.find.doctor.model.Specialization;
import ptsd14.find.doctor.repository.DoctorRepository;
import ptsd14.find.doctor.repository.FeedbackRepository;
import ptsd14.find.doctor.repository.HospitalRepository;
import ptsd14.find.doctor.repository.SpecializationRepos;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    private final HospitalRepository hospitalRepository;
    private final SpecializationRepos specializationRepository;
    private final FeedbackRepository feedbackRepository;

    @Transactional(readOnly = true)
    public Page<DoctorDto> getAll(Pageable pageable) {
        return doctorRepository.findAll(pageable)
                .map(doctorMapper::toDto);
    }
    @Transactional(readOnly = true)
    public Optional<DoctorDto> getById(Long id) {
        return doctorRepository.findById(id)
                .map(doctorMapper::toDto);
    }
    public List<DoctorDto> getDoctorsWithFeedback() {
        return doctorRepository.findAll().stream()
                .filter(doctor -> !feedbackRepository.findByAppointment_Doctor_Id(doctor.getId()).isEmpty())
                .map(doctorMapper::toDto)
                .collect(Collectors.toList());
    }

    // Return all doctors sorted by average rating descending
    public List<DoctorDto> getTopRatedDoctors() {
        return doctorRepository.findAll().stream()
                .map(doctorMapper::toDto)
                .sorted(Comparator.comparingDouble(DoctorDto::getAverageRating).reversed())
                .collect(Collectors.toList());
    }


    public DoctorDto create(DoctorDto dto) {
        Doctor doctor = doctorMapper.toEntity(dto);

        // Set hospital and specialization
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));
        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found"));

        doctor.setHospital(hospital);
        doctor.setSpecialization(specialization);

        Doctor saved = doctorRepository.save(doctor);
        return doctorMapper.toDto(saved);
    }

    public DoctorDto update(Long id, DoctorDto dto) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        existing.setFirstname(dto.getFirstname());
        existing.setLastname(dto.getLastname());
        existing.setStatus(dto.getStatus());

        // Update hospital and specialization
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));
        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found"));

        existing.setHospital(hospital);
        existing.setSpecialization(specialization);

        Doctor updated = doctorRepository.save(existing);
        return doctorMapper.toDto(updated);
    }

    public void delete(Long id) {
        doctorRepository.deleteById(id);
    }
}
