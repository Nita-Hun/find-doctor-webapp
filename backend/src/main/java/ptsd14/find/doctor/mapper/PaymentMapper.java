package ptsd14.find.doctor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ptsd14.find.doctor.dto.PaymentDto;
import ptsd14.find.doctor.model.Payment;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "appointmentId", source = "appointment.id")
    PaymentDto toDto(Payment payment);
    
    @Mapping(target = "appointment", ignore = true)
    Payment toEntity(PaymentDto paymentDto);
    
} 
    

