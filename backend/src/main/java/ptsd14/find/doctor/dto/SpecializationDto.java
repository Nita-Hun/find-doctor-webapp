package ptsd14.find.doctor.dto;

import java.time.LocalDateTime;

import lombok.Data;


@Data
public class SpecializationDto {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // // Static factory method for easy conversion
    // public static SpecializationDto fromEntity(Specialization specialization) {
    //     SpecializationDto dto = new SpecializationDto();
    //     dto.setId(specialization.getId());
    //     dto.setName(specialization.getName());
    //     return dto;
    // }
}
