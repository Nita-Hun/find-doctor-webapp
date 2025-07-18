package ptsd14.find.doctor.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminUserRequest {
    @NotNull
    private String roleName;  // send role name as string
    
    private boolean enabled;
}

