package ptsd14.find.doctor.mapper;

import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.model.Doctor;
import ptsd14.find.doctor.model.Patient;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-08T18:17:13+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class AppointmentMapperImpl implements AppointmentMapper {

    @Override
    public AppointmentDto toDto(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }

        AppointmentDto appointmentDto = new AppointmentDto();

        appointmentDto.setDoctorId( appointmentDoctorId( appointment ) );
        appointmentDto.setPatientId( appointmentPatientId( appointment ) );
        appointmentDto.setAppointmentTypeId( appointmentAppointmentTypeId( appointment ) );
        appointmentDto.setAppointmentTypeName( appointmentAppointmentTypeName( appointment ) );
        appointmentDto.setAmount( appointmentAppointmentTypePrice( appointment ) );
        appointmentDto.setAttachment( appointment.getAttachment() );
        appointmentDto.setCreatedAt( appointment.getCreatedAt() );
        appointmentDto.setDateTime( appointment.getDateTime() );
        appointmentDto.setId( appointment.getId() );
        appointmentDto.setNote( appointment.getNote() );
        appointmentDto.setUpdatedAt( appointment.getUpdatedAt() );

        appointmentDto.setDoctorName( appointment.getDoctor() != null ? appointment.getDoctor().getFirstname() + " " + appointment.getDoctor().getLastname() : null );
        appointmentDto.setPatientName( appointment.getPatient() != null ? appointment.getPatient().getFirstname() + " " + appointment.getPatient().getLastname() : null );

        return appointmentDto;
    }

    @Override
    public Appointment toEntity(AppointmentDto dto) {
        if ( dto == null ) {
            return null;
        }

        Appointment appointment = new Appointment();

        appointment.setAttachment( dto.getAttachment() );
        appointment.setDateTime( dto.getDateTime() );
        appointment.setId( dto.getId() );
        appointment.setNote( dto.getNote() );

        setRelationsFromDto( dto, appointment );

        return appointment;
    }

    @Override
    public void updateFromDto(AppointmentDto dto, Appointment entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getAttachment() != null ) {
            entity.setAttachment( dto.getAttachment() );
        }
        if ( dto.getDateTime() != null ) {
            entity.setDateTime( dto.getDateTime() );
        }
        if ( dto.getId() != null ) {
            entity.setId( dto.getId() );
        }
        if ( dto.getNote() != null ) {
            entity.setNote( dto.getNote() );
        }

        setRelationsFromDto( dto, entity );
    }

    private Long appointmentDoctorId(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        Doctor doctor = appointment.getDoctor();
        if ( doctor == null ) {
            return null;
        }
        Long id = doctor.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long appointmentPatientId(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        Patient patient = appointment.getPatient();
        if ( patient == null ) {
            return null;
        }
        Long id = patient.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long appointmentAppointmentTypeId(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        AppointmentType appointmentType = appointment.getAppointmentType();
        if ( appointmentType == null ) {
            return null;
        }
        Long id = appointmentType.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String appointmentAppointmentTypeName(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        AppointmentType appointmentType = appointment.getAppointmentType();
        if ( appointmentType == null ) {
            return null;
        }
        String name = appointmentType.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private BigDecimal appointmentAppointmentTypePrice(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        AppointmentType appointmentType = appointment.getAppointmentType();
        if ( appointmentType == null ) {
            return null;
        }
        BigDecimal price = appointmentType.getPrice();
        if ( price == null ) {
            return null;
        }
        return price;
    }
}
