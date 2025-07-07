package ptsd14.find.doctor.dto;

import java.math.BigDecimal;
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
    private String note;
    private String attachment;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
