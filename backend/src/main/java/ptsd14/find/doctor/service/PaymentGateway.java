package ptsd14.find.doctor.service;

import java.math.BigDecimal;

public interface PaymentGateway {
    PaymentResult charge(String cardNumber, String cvv, String expiryDate, BigDecimal amount);
}

