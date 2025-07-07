package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.PaymentDto;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.model.Payment;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-07T15:48:50+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public PaymentDto toDto(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        PaymentDto paymentDto = new PaymentDto();

        paymentDto.setAppointmentId( paymentAppointmentId( payment ) );
        paymentDto.setAmount( payment.getAmount() );
        paymentDto.setId( payment.getId() );
        paymentDto.setPaidAt( payment.getPaidAt() );
        paymentDto.setPaymentMethod( payment.getPaymentMethod() );
        paymentDto.setPaymentStatus( payment.getPaymentStatus() );

        paymentDto.setDoctorName( payment.getAppointment().getDoctor().getFirstname() + " " + payment.getAppointment().getDoctor().getLastname() );

        return paymentDto;
    }

    @Override
    public Payment toEntity(PaymentDto paymentDto) {
        if ( paymentDto == null ) {
            return null;
        }

        Payment payment = new Payment();

        payment.setAmount( paymentDto.getAmount() );
        payment.setId( paymentDto.getId() );
        payment.setPaidAt( paymentDto.getPaidAt() );
        payment.setPaymentMethod( paymentDto.getPaymentMethod() );
        payment.setPaymentStatus( paymentDto.getPaymentStatus() );

        payment.setAppointment( mapAppointment(paymentDto.getAppointmentId()) );

        return payment;
    }

    @Override
    public void updateFromDto(PaymentDto dto, Payment entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getAmount() != null ) {
            entity.setAmount( dto.getAmount() );
        }
        if ( dto.getPaidAt() != null ) {
            entity.setPaidAt( dto.getPaidAt() );
        }
        if ( dto.getPaymentMethod() != null ) {
            entity.setPaymentMethod( dto.getPaymentMethod() );
        }
        if ( dto.getPaymentStatus() != null ) {
            entity.setPaymentStatus( dto.getPaymentStatus() );
        }
    }

    private Long paymentAppointmentId(Payment payment) {
        if ( payment == null ) {
            return null;
        }
        Appointment appointment = payment.getAppointment();
        if ( appointment == null ) {
            return null;
        }
        Long id = appointment.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
