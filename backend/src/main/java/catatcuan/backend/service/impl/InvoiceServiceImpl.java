package catatcuan.backend.service.impl;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import catatcuan.backend.dto.request.InvoiceItemRequest;
import catatcuan.backend.dto.request.InvoiceRequest;
import catatcuan.backend.dto.request.UpdateStatusRequest;
import catatcuan.backend.dto.response.InvoiceResponse;
import catatcuan.backend.entity.Client;
import catatcuan.backend.entity.Invoice;
import catatcuan.backend.entity.InvoiceItem;
import catatcuan.backend.entity.InvoiceStatus;
import catatcuan.backend.exception.ResourceNotFoundException;
import catatcuan.backend.repository.ClientRepository;
import catatcuan.backend.repository.InvoiceRepository;
import catatcuan.backend.security.TenantContext;
import catatcuan.backend.service.InvoiceService;
import catatcuan.backend.util.PdfGenerator;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("invoiceNumber", "createdAt", "dueDate", "total", "status");

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;

    @Override
    @Transactional
    public InvoiceResponse create(InvoiceRequest request) {
        UUID tenantId = TenantContext.get();
        rejectManualOverdue(request.getStatus());

        Client client = getClientForCurrentTenant(request.getClientId(), tenantId);

        String invNum = request.getInvoiceNumber();
        if (invNum == null || invNum.trim().isEmpty()) {
            int year = LocalDate.now().getYear();
            long count = invoiceRepository.countByTenantId(tenantId) + 1;
            invNum = String.format("INV-%d-%04d", year, count);
        }

        Invoice invoice = Invoice.builder()
                .tenantId(tenantId)
                .client(client)
                .invoiceNumber(request.getInvoiceNumber())
                .invoiceNumber(invNum)
                .status(request.getStatus() != null ? request.getStatus() : InvoiceStatus.DRAFT)
                .dueDate(request.getDueDate())
                .build();

        invoice.getItems().addAll(buildItems(request.getItems(), invoice));
        recalculateTotals(invoice);

        return InvoiceResponse.from(invoiceRepository.save(invoice));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> findAll(
            String search, InvoiceStatus status,
            String sortBy, String sortDir, int page, int size) {

        UUID tenantId = TenantContext.get();
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String searchParam = (search == null || search.isBlank()) ? "" : search.trim();

        if (status == InvoiceStatus.OVERDUE) {
            return invoiceRepository
                    .searchOverdueByTenant(tenantId, searchParam, LocalDate.now(), InvoiceStatus.SENT, pageable)
                    .map(InvoiceResponse::from);
        }

        return invoiceRepository
                .searchByTenant(tenantId, searchParam, status, pageable)
                .map(InvoiceResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> findAll(int page, int size) {
        return findAll("", null, "createdAt", "desc", page, size);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse findById(UUID id) {
        return InvoiceResponse.from(getInvoiceForCurrentTenant(id));
    }

    @Override
    @Transactional
    public InvoiceResponse update(UUID id, InvoiceRequest request) {
        UUID tenantId = TenantContext.get();
        rejectManualOverdue(request.getStatus());

        Invoice invoice = getInvoiceForCurrentTenant(id);

        if (!invoice.getClient().getId().equals(request.getClientId())) {
            invoice.setClient(getClientForCurrentTenant(request.getClientId(), tenantId));
        }

        invoice.setInvoiceNumber(request.getInvoiceNumber());
        if (request.getStatus() != null) {
            invoice.setStatus(request.getStatus());
        }
        invoice.setDueDate(request.getDueDate());

        invoice.getItems().clear();
        invoice.getItems().addAll(buildItems(request.getItems(), invoice));
        recalculateTotals(invoice);

        return InvoiceResponse.from(invoiceRepository.save(invoice));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        invoiceRepository.delete(getInvoiceForCurrentTenant(id));
    }

    @Override
    @Transactional
    public InvoiceResponse updateStatus(UUID id, UpdateStatusRequest request) {
        rejectManualOverdue(request.getStatus());
        Invoice invoice = getInvoiceForCurrentTenant(id);
        invoice.setStatus(request.getStatus());
        return InvoiceResponse.from(invoiceRepository.save(invoice));
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePdf(UUID id) {
        return PdfGenerator.generate(findById(id));
    }

    private void rejectManualOverdue(InvoiceStatus status) {
        if (status == InvoiceStatus.OVERDUE) {
            throw new IllegalArgumentException(
                    "Status OVERDUE tidak dapat diset secara manual");
        }
    }

    private List<InvoiceItem> buildItems(List<InvoiceItemRequest> requests, Invoice invoice) {
        return requests.stream().map(req -> {
            BigDecimal lineTotal = req.getUnitPrice().multiply(BigDecimal.valueOf(req.getQty()));
            return InvoiceItem.builder()
                    .invoice(invoice)
                    .description(req.getDescription())
                    .qty(req.getQty())
                    .unitPrice(req.getUnitPrice())
                    .lineTotal(lineTotal)
                    .build();
        }).toList();

    }

    private void recalculateTotals(Invoice invoice) {
        BigDecimal subtotal = invoice.getItems().stream()
                .map(InvoiceItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        invoice.setSubtotal(subtotal);
        invoice.setTotal(subtotal);
    }

    private Invoice getInvoiceForCurrentTenant(UUID id) {
        return invoiceRepository.findByIdAndTenantId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
    }

    private Client getClientForCurrentTenant(UUID clientId, UUID tenantId) {
        return clientRepository.findByIdAndTenantId(clientId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
    }
}
