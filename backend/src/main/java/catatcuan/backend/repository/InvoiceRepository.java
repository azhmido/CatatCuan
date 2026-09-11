package catatcuan.backend.repository;

import catatcuan.backend.entity.Invoice;
import catatcuan.backend.entity.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    @Query("""
            SELECT i FROM Invoice i
            WHERE i.tenantId = :tenantId
              AND (:status IS NULL OR i.status = :status)
              AND LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Invoice> searchByTenant(
            @Param("tenantId") UUID tenantId,
            @Param("search") String search,
            @Param("status") InvoiceStatus status,
            Pageable pageable);

    @Query("""
            SELECT i FROM Invoice i
            WHERE i.tenantId = :tenantId
              AND i.status = :sentStatus
              AND i.dueDate < :today
              AND LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Invoice> searchOverdueByTenant(
            @Param("tenantId") UUID tenantId,
            @Param("search") String search,
            @Param("today") LocalDate today,
            @Param("sentStatus") InvoiceStatus sentStatus,
            Pageable pageable);

    Optional<Invoice> findByIdAndTenantId(UUID id, UUID tenantId);

    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i WHERE i.tenantId = :tenantId AND i.status = :paidStatus")
    BigDecimal sumPaidTotal(
            @Param("tenantId") UUID tenantId,
            @Param("paidStatus") InvoiceStatus paidStatus);

    long countByTenantId(UUID tenantId);

    long countByTenantIdAndStatusIn(UUID tenantId, List<InvoiceStatus> statuses);

    @Query("""
            SELECT COUNT(i) FROM Invoice i
            WHERE i.tenantId = :tenantId
              AND i.status = :sentStatus
              AND i.dueDate < :today
            """)
    long countOverdueByTenant(
            @Param("tenantId") UUID tenantId,
            @Param("today") LocalDate today,
            @Param("sentStatus") InvoiceStatus sentStatus);
}
