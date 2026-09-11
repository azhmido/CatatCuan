package catatcuan.backend.service.impl;

import catatcuan.backend.dto.request.PaymentRequest;
import catatcuan.backend.dto.response.PaymentResponse;
import catatcuan.backend.entity.Invoice;
import catatcuan.backend.entity.Payment;
import catatcuan.backend.exception.ResourceNotFoundException;
import catatcuan.backend.repository.InvoiceRepository;
import catatcuan.backend.repository.PaymentRepository;
import catatcuan.backend.security.TenantContext;
import catatcuan.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    @Transactional
    public PaymentResponse create(UUID invoiceId, PaymentRequest request) {
        Invoice invoice = getInvoiceForCurrentTenant(invoiceId);
        Payment payment = Payment.builder()
                .invoice(invoice)
                .amount(request.getAmount())
                .paidAt(request.getPaidAt())
                .method(request.getMethod())
                .note(request.getNote())
                .build();
        return PaymentResponse.from(paymentRepository.save(payment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findByInvoice(UUID invoiceId) {
        getInvoiceForCurrentTenant(invoiceId);
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(PaymentResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findAllForCurrentTenant() {
        UUID tenantId = TenantContext.get();
        return paymentRepository.findAllByTenantId(tenantId).stream()
                .map(PaymentResponse::from)
                .toList();
    }

    private Invoice getInvoiceForCurrentTenant(UUID invoiceId) {
        return invoiceRepository.findByIdAndTenantId(invoiceId, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", invoiceId));
    }
}

