package catatcuan.backend.dto.request;

import catatcuan.backend.entity.InvoiceStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class InvoiceRequest {

    @NotNull(message = "clientId tidak boleh null")
    private UUID clientId;

    private String invoiceNumber;

    private InvoiceStatus status;

    private LocalDate dueDate;

    @NotEmpty(message = "Invoice harus memiliki minimal 1 item")
    @Valid
    private List<InvoiceItemRequest> items;
}
