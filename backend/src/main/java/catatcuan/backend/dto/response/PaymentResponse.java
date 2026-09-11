package catatcuan.backend.dto.response;

import catatcuan.backend.entity.Payment;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class PaymentResponse {

    private UUID id;
    private UUID invoiceId;
    private String invoiceNumber;
    private String clientName;
    private BigDecimal amount;
    private LocalDate paidAt;
    private String method;
    private String note;
    private Instant createdAt;

    @JsonProperty("paymentDate")
    public LocalDate getPaymentDate() {
        return paidAt;
    }

    @JsonProperty("paymentMethod")
    public String getPaymentMethod() {
        return method;
    }

    @JsonProperty("notes")
    public String getNotes() {
        return note;
    }

    public static PaymentResponse from(Payment payment) {
        String invNum = payment.getInvoice() != null ? payment.getInvoice().getInvoiceNumber() : null;
        String cName = (payment.getInvoice() != null && payment.getInvoice().getClient() != null)
                ? payment.getInvoice().getClient().getName()
                : null;

        return PaymentResponse.builder()
                .id(payment.getId())
                .invoiceId(payment.getInvoice().getId())
                .invoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null)
                .invoiceNumber(invNum)
                .clientName(cName)
                .amount(payment.getAmount())
                .paidAt(payment.getPaidAt())
                .method(payment.getMethod())
                .note(payment.getNote())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}

