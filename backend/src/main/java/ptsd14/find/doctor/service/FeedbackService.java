package ptsd14.find.doctor.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ptsd14.find.doctor.dto.FeedbackDto;
import ptsd14.find.doctor.exception.ResourceNotFoundException;
import ptsd14.find.doctor.mapper.FeedbackMapper;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.Feedback;
import ptsd14.find.doctor.repository.AppointmentRepository;
import ptsd14.find.doctor.repository.FeedbackRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final AppointmentRepository appointmentRepository;
    private final FeedbackMapper feedbackMapper;

    @Transactional(readOnly = true)
    public Page<FeedbackDto> getAll(Pageable pageable) {
    return feedbackRepository.findAll(pageable)
            .map(feedbackMapper::toDto);
    }
    @Transactional(readOnly = true)
    public Optional<FeedbackDto> getById(Long id) {
        return feedbackRepository.findById(id)
                .map(feedbackMapper::toDto);
    }

    public FeedbackDto create(FeedbackDto dto) {
        Feedback feedback = feedbackMapper.toEntity(dto);

        if (dto.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid appointment ID"));
            feedback.setAppointment(appointment);
        }

        return feedbackMapper.toDto(feedbackRepository.save(feedback));
    }

    public FeedbackDto update(Long id, FeedbackDto dto) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        feedback.setRating(dto.getRating());
        feedback.setComment(dto.getComment());

        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        feedback.setAppointment(appointment);
        Feedback updated = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(updated);

    }

    public void delete(Long id) {
        feedbackRepository.deleteById(id);
    }
}
