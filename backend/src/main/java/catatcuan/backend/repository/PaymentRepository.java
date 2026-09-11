package catatcuan.backend.repository;

import catatcuan.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findByInvoiceId(UUID invoiceId);

    @Query("""
            SELECT p FROM Payment p
            JOIN p.invoice i
            WHERE i.tenantId = :tenantId
            ORDER BY p.paidAt DESC, p.createdAt DESC
            """)
    List<Payment> findAllByTenantId(@Param("tenantId") UUID tenantId);
}

