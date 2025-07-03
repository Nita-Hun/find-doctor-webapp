package ptsd14.find.doctor.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedbackDto {
    private Long id;
    private Integer rating;
    private String comment;
    private Long appointmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
