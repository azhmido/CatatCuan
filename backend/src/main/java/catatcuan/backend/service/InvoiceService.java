package catatcuan.backend.service;

import catatcuan.backend.dto.request.InvoiceRequest;
import catatcuan.backend.dto.request.UpdateStatusRequest;
import catatcuan.backend.dto.response.InvoiceResponse;
import catatcuan.backend.entity.InvoiceStatus;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface InvoiceService {

    InvoiceResponse create(InvoiceRequest request);

    Page<InvoiceResponse> findAll(
            String search, InvoiceStatus status, String sortBy, String sortDir, int page, int size);

    // Method overloading: pencarian default tanpa filter kata kunci & status
    Page<InvoiceResponse> findAll(int page, int size);

    InvoiceResponse findById(UUID id);

    InvoiceResponse update(UUID id, InvoiceRequest request);

    void delete(UUID id);

    InvoiceResponse updateStatus(UUID id, UpdateStatusRequest request);

    byte[] generatePdf(UUID id);
}
