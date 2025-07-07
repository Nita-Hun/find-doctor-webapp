package ptsd14.find.doctor.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ptsd14.find.doctor.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT DATE(p.paidAt), COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'PAID' AND p.paidAt >= :startDate GROUP BY DATE(p.paidAt) ORDER BY DATE(p.paidAt)")
    List<Object[]> findRevenueLast30Days(@Param("startDate") LocalDateTime startDate);

    Page<Payment> findByPaymentStatusIgnoreCaseAndAppointment_Patient_FirstnameContainingIgnoreCaseOrPaymentStatusIgnoreCaseAndAppointment_Doctor_FirstnameContainingIgnoreCase(
            String trim, String trim2, String trim3, String trim4, Pageable pageable);

    Page<Payment> findByPaymentStatusIgnoreCase(String trim, Pageable pageable);

    Page<Payment> findByAppointment_Patient_FirstnameContainingIgnoreCaseOrAppointment_Doctor_FirstnameContainingIgnoreCase(
            String trim, String trim2, Pageable pageable);

}
    

