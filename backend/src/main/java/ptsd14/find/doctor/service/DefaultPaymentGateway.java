package ptsd14.find.doctor.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

@Service
public class DefaultPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult charge(String cardNumber, String cvv, String expiryDate, BigDecimal amount) {

        return new PaymentResult(true, null);
    }
}
