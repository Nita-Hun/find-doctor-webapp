package ptsd14.find.doctor.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentDto {

    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private Long appointmentTypeId;
    private String appointmentTypeName;
    private LocalDateTime dateTime;
    private String status;
    private String attachment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
