// package ptsd14.find.doctor.service;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.List;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.stripe.model.PaymentIntent;
// import com.stripe.param.PaymentIntentCreateParams;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// import ptsd14.find.doctor.dto.PaymentDto;
// import ptsd14.find.doctor.exception.AppointmentNotFoundException;
// import ptsd14.find.doctor.exception.PaymentProcessingException;
// import ptsd14.find.doctor.exception.ResourceNotFoundException;
// import ptsd14.find.doctor.mapper.PaymentMapper;
// import ptsd14.find.doctor.model.Payment;
// import ptsd14.find.doctor.repository.AppointmentRepository;
// import ptsd14.find.doctor.repository.PaymentRepository;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// @Transactional
// public class PaymentService {
//     private final PaymentRepository paymentRepository;
//     private final PaymentMapper paymentMapper;
//     private final AppointmentRepository appointmentRepository;
//     private final PaymentGateway paymentGateway;

    
//     public PaymentDto processPayment(Long appointmentId, String cardNumber, String cvv,
//                                      String expiryDate, String amount) {

//         log.info("Starting payment processing for appointmentId={}, amount={}", appointmentId, amount);

//         // 1. Validate payment details
//         validatePaymentDetails(cardNumber, cvv, expiryDate, amount);

//         // 2. Convert amount
//         BigDecimal paymentAmount = new BigDecimal(amount);

//         // 3. Process payment
//         log.debug("Calling payment gateway to charge the card...");
//         PaymentResult result = paymentGateway.charge(cardNumber, cvv, expiryDate, paymentAmount);

//         // 4. Check result
//         if (result.isSuccess()) {
//             log.info("Payment processed successfully for appointmentId={}", appointmentId);

//             Payment payment = new Payment();
//             payment.setAmount(paymentAmount);
//             payment.setPaymentStatus("COMPLETED");
//             payment.setPaymentMethod("CREDIT_CARD");
//             payment.setPaidAt(LocalDateTime.now());
//             payment.setAppointment(
//                 appointmentRepository.findById(appointmentId)
//                     .orElseThrow(() -> new AppointmentNotFoundException(appointmentId))
//             );

//             Payment savedPayment = paymentRepository.save(payment);

//             log.debug("Payment saved with id={}", savedPayment.getId());
//             return paymentMapper.toDto(savedPayment);

//         } else {
//             log.warn("Payment failed for appointmentId={}, reason={}", appointmentId, result.getErrorMessage());
//             throw new PaymentProcessingException(result.getErrorMessage());
//         }
//     }

//     private void validatePaymentDetails(String cardNumber, String cvv,
//                                         String expiryDate, String amount) {
//         log.debug("Validating payment details: cardNumber={}, expiryDate={}", cardNumber, expiryDate);

//         if (cardNumber == null || cardNumber.length() < 13 || cardNumber.length() > 19) {
//             throw new IllegalArgumentException("Invalid card number");
//         }
//         if (cvv == null || cvv.length() < 3 || cvv.length() > 4) {
//             throw new IllegalArgumentException("Invalid CVV");
//         }
//         if (expiryDate == null || !expiryDate.matches("^(0[1-9]|1[0-2])/\\d{2}$")) {
//             throw new IllegalArgumentException("Expiry date must be in MM/YY format");
//         }
//         if (amount == null || amount.isEmpty()) {
//             throw new IllegalArgumentException("Invalid amount");
//         }
//         try {
//             new BigDecimal(amount);
//         } catch (NumberFormatException e) {
//             throw new IllegalArgumentException("Amount must be numeric");
//         }
//     }
//     public List<PaymentDto> getAllPayments() {
//     List<Payment> payments = paymentRepository.findAll();
//     return payments.stream()
//         .map(paymentMapper::toDto)
//         .toList();
//     }

//     public PaymentDto getPaymentById(Long id) {
//         Payment payment = paymentRepository.findById(id)
//             .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
//         return paymentMapper.toDto(payment);
//     }

//     public PaymentIntent createPaymentIntent(Long amountInCents, String currency) throws Exception {
//         PaymentIntentCreateParams params =
//             PaymentIntentCreateParams.builder()
//                 .setAmount(amountInCents)  // Amount in cents
//                 .setCurrency(currency)
//                 .build();

//         return PaymentIntent.create(params);
//     }

// }
