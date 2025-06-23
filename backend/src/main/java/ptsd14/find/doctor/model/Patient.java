package ptsd14.find.doctor.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "First name is required")
    private String firstname;

    @Column(nullable = false)
    @NotBlank(message = "Last name is required")
    private String lastname;

    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    private String status;

    @Column(nullable = false)
    @NotBlank(message = "Gender is required")
    private String gender;

    @Column(name = "date_of_birth", nullable = false)
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;  // Use LocalDate instead of String

    @Column(nullable = false)
    @NotBlank(message = "Address is required")
    private String address;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // Prevents infinite loop in JSON serialization
    private List<Appointment> appointments;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Pre-update method to set updatedAt
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}