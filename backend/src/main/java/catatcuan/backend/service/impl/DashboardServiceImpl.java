package catatcuan.backend.service.impl;

import catatcuan.backend.dto.response.DashboardSummaryResponse;
import catatcuan.backend.dto.response.InvoiceResponse;
import catatcuan.backend.entity.InvoiceStatus;
import catatcuan.backend.repository.InvoiceRepository;
import catatcuan.backend.security.TenantContext;
import catatcuan.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InvoiceRepository invoiceRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        UUID tenantId = TenantContext.get();
        LocalDate today = LocalDate.now();

        return DashboardSummaryResponse.builder()
                .totalRevenue(invoiceRepository.sumPaidTotal(tenantId, InvoiceStatus.PAID))
                .unpaidInvoiceCount(invoiceRepository.countByTenantIdAndStatusIn(
                        tenantId, List.of(InvoiceStatus.DRAFT, InvoiceStatus.SENT)))
                .overdueInvoiceCount(invoiceRepository.countOverdueByTenant(tenantId, today, InvoiceStatus.SENT))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getRecentInvoices() {
        UUID tenantId = TenantContext.get();
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        return invoiceRepository.searchByTenant(tenantId, "", null, pageable)
                .getContent()
                .stream()
                .map(InvoiceResponse::from)
                .toList();
    }
}

