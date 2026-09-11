package catatcuan.backend.controller;

import catatcuan.backend.dto.request.PaymentRequest;
import catatcuan.backend.dto.response.ApiResponse;
import catatcuan.backend.dto.response.PaymentResponse;
import catatcuan.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/api/invoices/{invoiceId}/payments")
    public ResponseEntity<ApiResponse<PaymentResponse>> create(
            @PathVariable UUID invoiceId,
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pembayaran berhasil dicatat",
                        paymentService.create(invoiceId, request)));
    }

    @GetMapping("/api/invoices/{invoiceId}/payments")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> findByInvoice(
            @PathVariable UUID invoiceId) {
        List<PaymentResponse> payments = paymentService.findByInvoice(invoiceId);
        String message = payments.isEmpty() ? "Belum ada pembayaran" : "OK";
        return ResponseEntity.ok(ApiResponse.success(message, payments));
    }

    @GetMapping("/api/payments")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> findAll() {
        List<PaymentResponse> payments = paymentService.findAllForCurrentTenant();
        String message = payments.isEmpty() ? "Belum ada pembayaran" : "OK";
        return ResponseEntity.ok(ApiResponse.success(message, payments));
    }
}


