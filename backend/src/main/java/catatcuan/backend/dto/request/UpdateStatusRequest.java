package catatcuan.backend.dto.request;

import catatcuan.backend.entity.InvoiceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request body untuk PATCH /api/invoices/{id}/status.
 */
@Getter
@Setter
@NoArgsConstructor
public class UpdateStatusRequest {

    @NotNull(message = "Status tidak boleh null")
    private InvoiceStatus status;
}

