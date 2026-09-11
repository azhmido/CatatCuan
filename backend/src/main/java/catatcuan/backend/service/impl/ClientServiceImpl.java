package catatcuan.backend.service.impl;

import catatcuan.backend.dto.request.ClientRequest;
import catatcuan.backend.dto.response.ClientResponse;
import catatcuan.backend.entity.Client;
import catatcuan.backend.exception.ResourceNotFoundException;
import catatcuan.backend.repository.ClientRepository;
import catatcuan.backend.security.TenantContext;
import catatcuan.backend.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("name", "createdAt");

    private final ClientRepository clientRepository;

    @Override
    @Transactional
    public ClientResponse create(ClientRequest request) {
        UUID tenantId = TenantContext.get();
        Client client = Client.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .contact(request.getContact())
                .address(request.getAddress())
                .build();
        return ClientResponse.from(clientRepository.save(client));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClientResponse> findAll(String search, String sortBy, String sortDir, int page, int size) {
        UUID tenantId = TenantContext.get();

        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Client> clients = (search == null || search.isBlank())
                ? clientRepository.findByTenantId(tenantId, pageable)
                : clientRepository.findByTenantIdAndNameContainingIgnoreCase(tenantId, search.trim(), pageable);

        return clients.map(ClientResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClientResponse> findAll(int page, int size) {
        return findAll("", "createdAt", "asc", page, size);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse findById(UUID id) {
        return ClientResponse.from(getClientForCurrentTenant(id));
    }

    @Override
    @Transactional
    public ClientResponse update(UUID id, ClientRequest request) {
        Client client = getClientForCurrentTenant(id);
        client.setName(request.getName());
        client.setContact(request.getContact());
        client.setAddress(request.getAddress());
        return ClientResponse.from(clientRepository.save(client));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        clientRepository.delete(getClientForCurrentTenant(id));
    }

    private Client getClientForCurrentTenant(UUID id) {
        return clientRepository.findByIdAndTenantId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));
    }
}
