package ptsd14.find.doctor.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class HospitalDto {
    private Long id;
    private String name;
    private String address;
    private String phone;
    
    // Optional: Add fromEntity method if you want manual mapping alternative
    // public static HospitalDto fromEntity(Hospital hospital) {
    //     HospitalDto dto = new HospitalDto();
    //     dto.setId(hospital.getId());
    //     dto.setName(hospital.getName());
    //     dto.setAddress(hospital.getAddress());
    //     dto.setPhone(hospital.getPhone());
    //     return dto;
    // }
}