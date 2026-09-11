package catatcuan.backend.service;

import catatcuan.backend.dto.request.ClientRequest;
import catatcuan.backend.dto.response.ClientResponse;
import catatcuan.backend.entity.Client;
import catatcuan.backend.repository.ClientRepository;
import catatcuan.backend.security.TenantContext;
import catatcuan.backend.service.impl.ClientServiceImpl;
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

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientServiceImpl clientService;

    private UUID tenantId;
    private UUID clientId;
    private Client sampleClient;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        clientId = UUID.randomUUID();
        TenantContext.set(tenantId);

        sampleClient = Client.builder()
                .tenantId(tenantId)
                .name("PT Nusantara Perkasa")
                .contact("081234567890")
                .address("Jl. Sudirman, Jakarta")
                .build();
        // Set the auto-generated id via reflection (BaseEntity)
        try {
            var idField = sampleClient.getClass().getSuperclass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(sampleClient, clientId);
        } catch (Exception ignored) { }
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("create - should persist and return mapped ClientResponse")
    void create_shouldPersistAndReturn() {
        ClientRequest req = new ClientRequest();
        req.setName("PT Nusantara Perkasa");
        req.setContact("081234567890");
        req.setAddress("Jl. Sudirman, Jakarta");

        when(clientRepository.save(any(Client.class))).thenReturn(sampleClient);

        ClientResponse result = clientService.create(req);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("PT Nusantara Perkasa");
        assertThat(result.getContact()).isEqualTo("081234567890");
        verify(clientRepository, times(1)).save(any(Client.class));
    }

    @Test
    @DisplayName("findAll - no search term should call findByTenantId")
    void findAll_noSearch_callsCorrectRepository() {
        Page<Client> page = new PageImpl<>(List.of(sampleClient));
        when(clientRepository.findByTenantId(eq(tenantId), any(Pageable.class))).thenReturn(page);

        Page<ClientResponse> result = clientService.findAll(null, "name", "asc", 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("PT Nusantara Perkasa");
        verify(clientRepository).findByTenantId(eq(tenantId), any(Pageable.class));
        verify(clientRepository, never()).findByTenantIdAndNameContainingIgnoreCase(any(), any(), any());
    }

    @Test
    @DisplayName("findAll - with search term should call search repository method")
    void findAll_withSearch_callsSearchRepository() {
        Page<Client> page = new PageImpl<>(List.of(sampleClient));
        when(clientRepository.findByTenantIdAndNameContainingIgnoreCase(eq(tenantId), eq("nusantara"), any(Pageable.class)))
                .thenReturn(page);

        Page<ClientResponse> result = clientService.findAll("nusantara", "name", "asc", 0, 10);

        assertThat(result.getContent()).hasSize(1);
        verify(clientRepository).findByTenantIdAndNameContainingIgnoreCase(eq(tenantId), eq("nusantara"), any(Pageable.class));
    }

    @Test
    @DisplayName("findById - should return ClientResponse when found")
    void findById_shouldReturnClientResponse() {
        when(clientRepository.findByIdAndTenantId(clientId, tenantId)).thenReturn(Optional.of(sampleClient));

        ClientResponse result = clientService.findById(clientId);

        assertThat(result.getId()).isEqualTo(clientId);
        assertThat(result.getName()).isEqualTo("PT Nusantara Perkasa");
    }

    @Test
    @DisplayName("findById - should throw ResourceNotFoundException when not found")
    void findById_shouldThrowWhenNotFound() {
        when(clientRepository.findByIdAndTenantId(any(), any())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> clientService.findById(UUID.randomUUID()));
    }

    @Test
    @DisplayName("update - should update fields and return mapped response")
    void update_shouldUpdateFields() {
        when(clientRepository.findByIdAndTenantId(clientId, tenantId)).thenReturn(Optional.of(sampleClient));
        when(clientRepository.save(any(Client.class))).thenReturn(sampleClient);

        ClientRequest req = new ClientRequest();
        req.setName("PT Updated");
        req.setContact("089999999999");
        req.setAddress("Jl. Baru No 1");

        ClientResponse result = clientService.update(clientId, req);

        assertThat(result).isNotNull();
        verify(clientRepository).save(sampleClient);
        // name was set on the entity
        assertThat(sampleClient.getName()).isEqualTo("PT Updated");
    }

    @Test
    @DisplayName("delete - should call repository delete exactly once")
    void delete_shouldCallRepositoryDelete() {
        when(clientRepository.findByIdAndTenantId(clientId, tenantId)).thenReturn(Optional.of(sampleClient));

        clientService.delete(clientId);

        verify(clientRepository, times(1)).delete(sampleClient);
    }

    @Test
    @DisplayName("findAll(page, size) overload should delegate to full findAll with defaults")
    void findAll_overload_delegatesToFullFindAll() {
        Page<Client> page = new PageImpl<>(List.of(sampleClient));
        when(clientRepository.findByTenantId(eq(tenantId), any(Pageable.class))).thenReturn(page);

        Page<ClientResponse> result = clientService.findAll(0, 10);

        assertThat(result.getContent()).hasSize(1);
    }
}