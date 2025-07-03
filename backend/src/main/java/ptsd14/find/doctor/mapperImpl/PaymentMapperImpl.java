package ptsd14.find.doctor.mapperImpl;

import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.PaymentDto;
import ptsd14.find.doctor.mapper.PaymentMapper;
import ptsd14.find.doctor.model.Payment;

@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public PaymentDto toDto(Payment payment) {
        if (payment == null) {
            return null;
        }

        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setPaymentStatus(payment.getPaymentStatus());
        paymentDto.setPaymentMethod(payment.getPaymentMethod());
        paymentDto.setPaidAt(payment.getPaidAt());
        
        if (payment.getAppointment() != null) {
            paymentDto.setAppointmentId(payment.getAppointment().getId());
        }

        return paymentDto;
    }

    @Override
    public Payment toEntity(PaymentDto paymentDto) {
        if (paymentDto == null) {
            return null;
        }

        Payment payment = new Payment();
        payment.setId(paymentDto.getId());
        payment.setAmount(paymentDto.getAmount());
        payment.setPaymentStatus(paymentDto.getPaymentStatus());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setPaidAt(paymentDto.getPaidAt());
        // Note: Appointment would need to be set separately as it requires fetching from repository

        return payment;
    }
}
