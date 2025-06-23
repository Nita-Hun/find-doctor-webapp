package ptsd14.find.doctor.dto;

import lombok.Data;


@Data
public class SpecializationDto {
    private Long id;
    private String name;

    // // Static factory method for easy conversion
    // public static SpecializationDto fromEntity(Specialization specialization) {
    //     SpecializationDto dto = new SpecializationDto();
    //     dto.setId(specialization.getId());
    //     dto.setName(specialization.getName());
    //     return dto;
    // }
}
