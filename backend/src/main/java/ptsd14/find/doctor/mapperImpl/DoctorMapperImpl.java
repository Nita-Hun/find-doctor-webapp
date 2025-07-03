package ptsd14.find.doctor.mapperImpl;


import java.util.List;

import org.springframework.aot.generate.Generated;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.mapper.DoctorMapper;
import ptsd14.find.doctor.model.Doctor;
import ptsd14.find.doctor.model.Feedback;
import ptsd14.find.doctor.repository.FeedbackRepository;

@Generated
@Component
@RequiredArgsConstructor
public class DoctorMapperImpl implements DoctorMapper {

    private final FeedbackRepository feedbackRepository;
    @Override
    public DoctorDto toDto(Doctor doctor) {
        if (doctor == null) {
            return null;
        }

        DoctorDto doctorDto = new DoctorDto();
        doctorDto.setId(doctor.getId());
        doctorDto.setFirstname(doctor.getFirstname());
        doctorDto.setLastname(doctor.getLastname());
        doctorDto.setStatus(doctor.getStatus());
        doctorDto.setCreatedAt(doctor.getCreatedAt());
        doctorDto.setUpdatedAt(doctor.getUpdatedAt());

        if (doctor.getHospital() != null) {
            doctorDto.setHospitalId(doctor.getHospital().getId());
            doctorDto.setHospitalName(doctor.getHospital().getName());
        }

        if (doctor.getSpecialization() != null) {
            doctorDto.setSpecializationId(doctor.getSpecialization().getId());
            doctorDto.setSpecializationName(doctor.getSpecialization().getName());
        }
        List<Feedback> feedbacks = feedbackRepository.findByAppointment_Doctor_Id(doctor.getId());

        doctorDto.setTotalFeedbacks(feedbacks.size());

        double avgRating = 0.0;
        if (!feedbacks.isEmpty()) {
            avgRating = feedbacks.stream()
                    .mapToInt(Feedback::getRating)
                    .average()
                    .orElse(0.0);
        }
        doctorDto.setAverageRating(avgRating);

        return doctorDto;
    }

    @Override
    public Doctor toEntity(DoctorDto doctorDto) {
        if (doctorDto == null) {
            return null;
        }

        Doctor doctor = new Doctor();
        doctor.setId(doctorDto.getId());
        doctor.setFirstname(doctorDto.getFirstname());
        doctor.setLastname(doctorDto.getLastname());
        doctor.setStatus(doctorDto.getStatus());
        // Note: Relationships are set in the service layer
        return doctor;
    }
}
