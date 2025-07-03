package ptsd14.find.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String role;  // stored as String
    private String profilePhotoUrl;
    private String createdAt;
    private String updatedAt;

    // Convenience constructor to accept Role enum and convert it to String
    public UserDto(Long id, String email, Enum<?> roleEnum, String profilePhotoUrl, String createdAt, String updatedAt) {
        this.id = id;
        this.email = email;
        this.role = roleEnum != null ? roleEnum.name() : null;
        this.profilePhotoUrl = profilePhotoUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
