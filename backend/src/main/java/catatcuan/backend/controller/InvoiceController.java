package catatcuan.backend.controller;

import catatcuan.backend.dto.request.InvoiceRequest;
import catatcuan.backend.dto.request.UpdateStatusRequest;
import catatcuan.backend.dto.response.ApiResponse;
import catatcuan.backend.dto.response.InvoiceResponse;
import catatcuan.backend.entity.InvoiceStatus;
import catatcuan.backend.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> create(
            @Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Invoice berhasil dibuat", invoiceService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> findAll(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {

        Page<InvoiceResponse> result = invoiceService.findAll(search, status, sortBy, sortDir, page, size);
        String message = result.isEmpty() ? "Data tidak ditemukan" : "OK";
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("OK", invoiceService.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Invoice berhasil diperbarui",
                invoiceService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        invoiceService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice berhasil dihapus"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Status invoice diperbarui",
                invoiceService.updateStatus(id, request)));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable UUID id) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + id + ".pdf");
        return new ResponseEntity<>(invoiceService.generatePdf(id), headers, HttpStatus.OK);
    }
}
