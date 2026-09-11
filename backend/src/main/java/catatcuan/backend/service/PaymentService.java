package catatcuan.backend.service;

import catatcuan.backend.dto.request.PaymentRequest;
import catatcuan.backend.dto.response.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentResponse create(UUID invoiceId, PaymentRequest request);

    List<PaymentResponse> findByInvoice(UUID invoiceId);

    List<PaymentResponse> findAllForCurrentTenant();
}

