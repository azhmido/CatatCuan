package catatcuan.backend.repository;

import catatcuan.backend.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ClientRepository extends JpaRepository<Client, UUID> {

    Page<Client> findByTenantIdAndNameContainingIgnoreCase(UUID tenantId, String name, Pageable pageable);

    Page<Client> findByTenantId(UUID tenantId, Pageable pageable);

    Optional<Client> findByIdAndTenantId(UUID id, UUID tenantId);
}
