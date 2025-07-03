package ptsd14.find.doctor.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ptsd14.find.doctor.model.Role;

@Data
public class AdminUserRequest {
    @NotNull
    private Role role;
    
    private boolean enabled;
}
