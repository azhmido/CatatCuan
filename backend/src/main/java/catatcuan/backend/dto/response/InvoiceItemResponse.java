package catatcuan.backend.dto.response;

import catatcuan.backend.entity.InvoiceItem;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
public class InvoiceItemResponse {

    private UUID id;
    private String description;
    private Integer qty;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    @com.fasterxml.jackson.annotation.JsonProperty("quantity")
    public Integer getQuantity() {
        return qty;
    }

    public static InvoiceItemResponse from(InvoiceItem item) {
        return InvoiceItemResponse.builder()
                .id(item.getId())
                .description(item.getDescription())
                .qty(item.getQty())
                .unitPrice(item.getUnitPrice())
                .lineTotal(item.getLineTotal())
                .build();
    }
}
