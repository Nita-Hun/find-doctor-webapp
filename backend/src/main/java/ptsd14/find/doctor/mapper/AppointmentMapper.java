package ptsd14.find.doctor.mapper;

import org.mapstruct.*;
import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.model.Appointment;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AppointmentMapper {

    // ENTITY -> DTO
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(target = "doctorName", expression = "java(appointment.getDoctor() != null ? appointment.getDoctor().getFirstname() + \" \" + appointment.getDoctor().getLastname() : null)")
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(target = "patientName", expression = "java(appointment.getPatient() != null ? appointment.getPatient().getFirstname() + \" \" + appointment.getPatient().getLastname() : null)")
    @Mapping(source = "appointmentType.id", target = "appointmentTypeId")
    @Mapping(source = "appointmentType.name", target = "appointmentTypeName")
    @Mapping(source = "appointmentType.price", target = "amount") // Added amount mapping
    AppointmentDto toDto(Appointment appointment);
    

    // DTO -> ENTITY
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "appointmentType", ignore = true)
    @Mapping(target = "emails", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Appointment toEntity(AppointmentDto dto);

    // UPDATE ENTITY
    @Mapping(target = "doctor", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "appointmentType", ignore = true)
    @Mapping(target = "emails", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromDto(AppointmentDto dto, @MappingTarget Appointment entity);

    @AfterMapping
    default void setRelationsFromDto(AppointmentDto dto, @MappingTarget Appointment entity) {
        if (dto.getDoctorId() != null) {
            var doctor = new ptsd14.find.doctor.model.Doctor();
            doctor.setId(dto.getDoctorId());
            entity.setDoctor(doctor);
        }
        if (dto.getPatientId() != null) {
            var patient = new ptsd14.find.doctor.model.Patient();
            patient.setId(dto.getPatientId());
            entity.setPatient(patient);
        }
        if (dto.getAppointmentTypeId() != null) {
            var appointmentType = new ptsd14.find.doctor.model.AppointmentType();
            appointmentType.setId(dto.getAppointmentTypeId());
            entity.setAppointmentType(appointmentType);
        }
    }
}
