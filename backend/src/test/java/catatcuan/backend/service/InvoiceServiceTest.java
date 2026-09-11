package catatcuan.backend.service;

import catatcuan.backend.dto.request.InvoiceItemRequest;
import catatcuan.backend.dto.request.InvoiceRequest;
import catatcuan.backend.dto.request.UpdateStatusRequest;
import catatcuan.backend.dto.response.InvoiceResponse;
import catatcuan.backend.entity.Client;
import catatcuan.backend.entity.Invoice;
import catatcuan.backend.entity.InvoiceStatus;
import catatcuan.backend.repository.ClientRepository;
import catatcuan.backend.repository.InvoiceRepository;
import catatcuan.backend.security.TenantContext;
import catatcuan.backend.service.impl.InvoiceServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private InvoiceServiceImpl invoiceService;

    private UUID tenantId;
    private UUID clientId;
    private UUID invoiceId;
    private Client sampleClient;
    private Invoice sampleInvoice;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        clientId = UUID.randomUUID();
        invoiceId = UUID.randomUUID();
        TenantContext.set(tenantId);

        sampleClient = Client.builder()
                .tenantId(tenantId)
                .name("CV Solusi Kreatif")
                .contact("081122334455")
                .address("Jl. Pahlawan, Surabaya")
                .build();
        setId(sampleClient, clientId);

        sampleInvoice = Invoice.builder()
                .tenantId(tenantId)
                .client(sampleClient)
                .invoiceNumber("INV-2026-0001")
                .status(InvoiceStatus.DRAFT)
                .dueDate(LocalDate.of(2026, 12, 31))
                .subtotal(BigDecimal.valueOf(1_500_000))
                .total(BigDecimal.valueOf(1_500_000))
                .build();
        setId(sampleInvoice, invoiceId);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    /** Utility: set the inherited BaseEntity.id field via reflection */
    private void setId(Object entity, UUID id) {
        try {
            var field = entity.getClass().getSuperclass().getDeclaredField("id");
            field.setAccessible(true);
            field.set(entity, id);
        } catch (Exception ignored) { }
    }

    // ------------------------------------------------------------------
    // create
    // ------------------------------------------------------------------

    @Test
    @DisplayName("create - auto-generates invoice number when not provided")
    void create_autoGeneratesInvoiceNumber() {
        InvoiceItemRequest itemReq = new InvoiceItemRequest();
        itemReq.setDescription("Jasa Desain Logo");
        itemReq.setQty(1);
        itemReq.setUnitPrice(BigDecimal.valueOf(500_000));

        InvoiceRequest req = new InvoiceRequest();
        req.setClientId(clientId);
        req.setDueDate(LocalDate.of(2026, 12, 31));
        req.setItems(List.of(itemReq));
        // No invoiceNumber — should be auto-generated

        when(clientRepository.findByIdAndTenantId(clientId, tenantId)).thenReturn(Optional.of(sampleClient));
        when(invoiceRepository.countByTenantId(tenantId)).thenReturn(0L);
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice i = inv.getArgument(0);
            setId(i, invoiceId);
            return i;
        });

        InvoiceResponse result = invoiceService.create(req);

        assertThat(result).isNotNull();
        assertThat(result.getInvoiceNumber()).matches("INV-\\d{4}-\\d{4}");
        verify(invoiceRepository).countByTenantId(tenantId);
        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    @DisplayName("create - uses provided invoice number when supplied")
    void create_usesProvidedInvoiceNumber() {
        InvoiceItemRequest itemReq = new InvoiceItemRequest();
        itemReq.setDescription("Maintenance");
        itemReq.setQty(2);
        itemReq.setUnitPrice(BigDecimal.valueOf(750_000));

        InvoiceRequest req = new InvoiceRequest();
        req.setClientId(clientId);
        req.setInvoiceNumber("CUSTOM-001");
        req.setDueDate(LocalDate.now().plusDays(30));
        req.setItems(List.of(itemReq));

        when(clientRepository.findByIdAndTenantId(clientId, tenantId)).thenReturn(Optional.of(sampleClient));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice i = inv.getArgument(0);
            setId(i, invoiceId);
            return i;
        });

        InvoiceResponse result = invoiceService.create(req);

        assertThat(result.getInvoiceNumber()).isEqualTo("CUSTOM-001");
    }

    @Test
    @DisplayName("create - rejects OVERDUE status on creation")
    void create_rejectsOverdueStatus() {
        InvoiceRequest req = new InvoiceRequest();
        req.setClientId(clientId);
        req.setStatus(InvoiceStatus.OVERDUE);
        req.setItems(List.of());

        assertThrows(IllegalArgumentException.class, () -> invoiceService.create(req));
        verify(invoiceRepository, never()).save(any());
    }

    // ------------------------------------------------------------------
    // findAll
    // ------------------------------------------------------------------

    @Test
    @DisplayName("findAll - returns paginated response filtered by tenant")
    void findAll_returnsPaginatedResults() {
        Page<Invoice> page = new PageImpl<>(List.of(sampleInvoice));
        when(invoiceRepository.searchByTenant(eq(tenantId), eq(""), isNull(), any(Pageable.class)))
                .thenReturn(page);

        Page<InvoiceResponse> result = invoiceService.findAll("", null, "createdAt", "desc", 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getInvoiceNumber()).isEqualTo("INV-2026-0001");
    }

    @Test
    @DisplayName("findAll - OVERDUE filter delegates to searchOverdueByTenant")
    void findAll_overdueStatus_callsOverdueRepository() {
        Page<Invoice> page = new PageImpl<>(List.of(sampleInvoice));
        when(invoiceRepository.searchOverdueByTenant(
                eq(tenantId), eq(""), any(LocalDate.class), eq(InvoiceStatus.SENT), any(Pageable.class)))
                .thenReturn(page);

        Page<InvoiceResponse> result = invoiceService.findAll("", InvoiceStatus.OVERDUE, "dueDate", "asc", 0, 10);

        assertThat(result.getContent()).hasSize(1);
        verify(invoiceRepository).searchOverdueByTenant(any(), any(), any(), any(), any());
    }

    // ------------------------------------------------------------------
    // findById
    // ------------------------------------------------------------------

    @Test
    @DisplayName("findById - returns mapped InvoiceResponse when found")
    void findById_returnsResponse() {
        when(invoiceRepository.findByIdAndTenantId(invoiceId, tenantId)).thenReturn(Optional.of(sampleInvoice));

        InvoiceResponse result = invoiceService.findById(invoiceId);

        assertThat(result.getInvoiceNumber()).isEqualTo("INV-2026-0001");
        assertThat(result.getClientName()).isEqualTo("CV Solusi Kreatif");
    }

    @Test
    @DisplayName("findById - throws when invoice not found for tenant")
    void findById_throwsWhenNotFound() {
        when(invoiceRepository.findByIdAndTenantId(any(), any())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> invoiceService.findById(UUID.randomUUID()));
    }

    // ------------------------------------------------------------------
    // updateStatus
    // ------------------------------------------------------------------

    @Test
    @DisplayName("updateStatus - updates status and returns saved response")
    void updateStatus_updatesCorrectly() {
        when(invoiceRepository.findByIdAndTenantId(invoiceId, tenantId)).thenReturn(Optional.of(sampleInvoice));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(sampleInvoice);

        UpdateStatusRequest req = new UpdateStatusRequest();
        req.setStatus(InvoiceStatus.SENT);

        InvoiceResponse result = invoiceService.updateStatus(invoiceId, req);

        assertThat(result).isNotNull();
        assertThat(sampleInvoice.getStatus()).isEqualTo(InvoiceStatus.SENT);
        verify(invoiceRepository).save(sampleInvoice);
    }

    @Test
    @DisplayName("updateStatus - rejects OVERDUE status")
    void updateStatus_rejectsOverdue() {
        UpdateStatusRequest req = new UpdateStatusRequest();
        req.setStatus(InvoiceStatus.OVERDUE);

        assertThrows(IllegalArgumentException.class, () -> invoiceService.updateStatus(invoiceId, req));
        verify(invoiceRepository, never()).save(any());
    }

    // ------------------------------------------------------------------
    // delete
    // ------------------------------------------------------------------

    @Test
    @DisplayName("delete - should call repository delete exactly once")
    void delete_callsRepositoryDelete() {
        when(invoiceRepository.findByIdAndTenantId(invoiceId, tenantId)).thenReturn(Optional.of(sampleInvoice));

        invoiceService.delete(invoiceId);

        verify(invoiceRepository, times(1)).delete(sampleInvoice);
    }
}