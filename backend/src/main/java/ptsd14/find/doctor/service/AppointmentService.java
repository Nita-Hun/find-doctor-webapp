package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.AppointmentMapper;
import ptsd14.find.doctor.model.*;
import ptsd14.find.doctor.repository.*;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentTypeRepository appointmentTypeRepository;

    @Transactional(readOnly = true)
        public Page<AppointmentDto> getAll(Pageable pageable, String search) {
        if (search == null || search.trim().isEmpty()) {
                Page<Appointment> appointments = appointmentRepository.findAll(pageable);
                return appointments.map(appointmentMapper::toDto);
        } else {
                Page<Appointment> appointments = appointmentRepository.findByDoctorNameContainingIgnoreCase(search.trim(), pageable);
                return appointments.map(appointmentMapper::toDto);
        }
        }


    @Transactional(readOnly = true)
        public Optional<AppointmentDto> getById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toDto);
    }

    @Transactional
        public AppointmentDto create(AppointmentDto dto) {
        Appointment appointment = appointmentMapper.toEntity(dto);

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        AppointmentType appointmentType = appointmentTypeRepository.findById(dto.getAppointmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment type not found"));

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentType(appointmentType);

        Appointment saved = appointmentRepository.save(appointment);
        
        return appointmentMapper.toDto(saved); 
        }

        @Transactional
        public AppointmentDto update(Long id, AppointmentDto dto) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        existing.setDateTime(dto.getDateTime());
        existing.setNote(dto.getNote());
        existing.setAttachment(dto.getAttachment());
        
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        AppointmentType appointmentType = appointmentTypeRepository.findById(dto.getAppointmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment type not found"));

        existing.setDoctor(doctor);
        existing.setPatient(patient);
        existing.setAppointmentType(appointmentType);

        Appointment updated = appointmentRepository.save(existing);
        return appointmentMapper.toDto(updated);
        }


    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }

    
}

