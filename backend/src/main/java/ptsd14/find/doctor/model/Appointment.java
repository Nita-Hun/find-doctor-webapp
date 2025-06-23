package ptsd14.find.doctor.model;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "appointmentType_id", nullable = false)
    private AppointmentType appointmentType;

    @Column(nullable = false)
    @NotNull(message = "Appointment date and time are required")
    private LocalDateTime dateTime;

    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    private String status;

    private String attachment;  // Optional field (nullable)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Email> emails;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Payment> payments;

    // Pre-persist method to set createdAt (if not using default)
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