package catatcuan.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class InvoiceItemRequest {

    @NotBlank(message = "Deskripsi item tidak boleh kosong")
    private String description;

    @NotNull(message = "Qty tidak boleh null")
    @Min(value = 1, message = "Qty minimal 1")
    private Integer qty;

    @NotNull(message = "Harga satuan tidak boleh null")
    @Positive(message = "Harga satuan harus lebih dari 0")
    private BigDecimal unitPrice;

    public void setQuantity(Integer quantity) {
        if (this.qty == null) {
            this.qty = quantity;
        }
    }
}

