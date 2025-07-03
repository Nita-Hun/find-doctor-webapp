// package ptsd14.find.doctor.service;

// import org.springframework.beans.factory.annotation.Value;

// import com.stripe.Stripe;
// import com.stripe.param.checkout.SessionCreateParams;

// import ptsd14.find.doctor.dto.PaymentRequest;
// import ptsd14.find.doctor.dto.StripeResponse;

// public class StripeService {

//     @Value("${stripe.secret.key}")
//     private String secretKey;
//     public StripeResponse checkoutAppointments(PaymentRequest paymentRequest){
//         Stripe.apiKey= secretKey;
//         SessionCreateParams.LineItem.PriceData.ProductData.builder();
//             .setAppointmentId(paymentRequest.getAppointmentId()).build();
//     }
    
// }
