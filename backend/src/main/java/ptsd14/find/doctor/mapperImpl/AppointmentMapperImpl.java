package ptsd14.find.doctor.mapperImpl;

import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.mapper.AppointmentMapper;
import ptsd14.find.doctor.model.*;

@Component
public class AppointmentMapperImpl implements AppointmentMapper {

    @Override
    public AppointmentDto toDto(Appointment appointment) {
        if (appointment == null) return null;

        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setDoctorId(appointment.getDoctor() != null ? appointment.getDoctor().getId() : null);
        dto.setPatientId(appointment.getPatient() != null ? appointment.getPatient().getId() : null);
        dto.setAppointmentTypeId(appointment.getAppointmentType() != null ? appointment.getAppointmentType().getId() : null);
        dto.setDateTime(appointment.getDateTime());
        dto.setStatus(appointment.getStatus());
        dto.setAttachment(appointment.getAttachment());
        dto.setCreatedAt(appointment.getCreatedAt());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        return dto;
    }

    @Override
    public Appointment toEntity(AppointmentDto dto) {
        if (dto == null) return null;

        Appointment appointment = new Appointment();
        appointment.setId(dto.getId());

        Doctor doctor = new Doctor();
        doctor.setId(dto.getDoctorId());
        appointment.setDoctor(doctor);

        Patient patient = new Patient();
        patient.setId(dto.getPatientId());
        appointment.setPatient(patient);

        AppointmentType type = new AppointmentType();
        type.setId(dto.getAppointmentTypeId());
        appointment.setAppointmentType(type);

        appointment.setDateTime(dto.getDateTime());
        appointment.setStatus(dto.getStatus());
        appointment.setAttachment(dto.getAttachment());
        appointment.setCreatedAt(dto.getCreatedAt());
        appointment.setUpdatedAt(dto.getUpdatedAt());

        return appointment;
    }
}
