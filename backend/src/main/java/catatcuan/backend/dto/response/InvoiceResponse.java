package catatcuan.backend.dto.response;

import catatcuan.backend.entity.Invoice;
import catatcuan.backend.entity.InvoiceStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class InvoiceResponse {

    private UUID id;
    private UUID clientId;
    private String clientName;
    private String invoiceNumber;
    private InvoiceStatus status;
    private LocalDate dueDate;
    private BigDecimal subtotal;
    private BigDecimal total;
    private List<InvoiceItemResponse> items;
    private Instant createdAt;
    private Instant updatedAt;

    public static InvoiceResponse from(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .clientId(invoice.getClient().getId())
                .clientName(invoice.getClient().getName())
                .invoiceNumber(invoice.getInvoiceNumber())
                .status(deriveStatus(invoice))
                .dueDate(invoice.getDueDate())
                .subtotal(invoice.getSubtotal())
                .total(invoice.getTotal())
                .items(invoice.getItems().stream().map(InvoiceItemResponse::from).toList())
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .build();
    }

    public static InvoiceStatus deriveStatus(Invoice invoice) {
        if (invoice.getStatus() == InvoiceStatus.SENT
                && invoice.getDueDate() != null
                && invoice.getDueDate().isBefore(LocalDate.now())) {
            return InvoiceStatus.OVERDUE;
        }
        return invoice.getStatus();
    }
}
