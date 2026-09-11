package catatcuan.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Jumlah pembayaran tidak boleh null")
    @Positive(message = "Jumlah pembayaran harus lebih dari 0")
    private BigDecimal amount;

    @NotNull(message = "Tanggal pembayaran tidak boleh null")
    private LocalDate paidAt;

    private String method;

    private String note;

    @JsonSetter("paymentDate")
    public void setPaymentDate(LocalDate paymentDate) {
        if (this.paidAt == null) {
            this.paidAt = paymentDate;
        }
    }

    @JsonSetter("paymentMethod")
    public void setPaymentMethod(String paymentMethod) {
        if (this.method == null) {
            this.method = paymentMethod;
        }
    }

    @JsonSetter("notes")
    public void setNotes(String notes) {
        if (this.note == null) {
            this.note = notes;
        }
    }
}

