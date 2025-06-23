package ptsd14.find.doctor.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @Column(nullable = false)
    @NotBlank(message = "Payment status is required")
    private String paymentStatus;

    @Column(nullable = false)
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @Column(name = "paid_at", nullable = false, updatable = false)
    private LocalDateTime paidAt = LocalDateTime.now();  // Default to current time

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)  // Ensures 1:1
    private Appointment appointment;

    // Getters and setters
}