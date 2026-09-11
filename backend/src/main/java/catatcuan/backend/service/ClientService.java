package catatcuan.backend.service;

import catatcuan.backend.dto.request.ClientRequest;
import catatcuan.backend.dto.response.ClientResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ClientService {

    ClientResponse create(ClientRequest request);

    Page<ClientResponse> findAll(String search, String sortBy, String sortDir, int page, int size);

    // Method overloading: pencarian default tanpa filter kata kunci & pengurutan bawaan
    Page<ClientResponse> findAll(int page, int size);

    ClientResponse findById(UUID id);

    ClientResponse update(UUID id, ClientRequest request);

    void delete(UUID id);
}
