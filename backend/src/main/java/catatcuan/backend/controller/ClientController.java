package catatcuan.backend.controller;

import catatcuan.backend.dto.request.ClientRequest;
import catatcuan.backend.dto.response.ApiResponse;
import catatcuan.backend.dto.response.ClientResponse;
import catatcuan.backend.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClientResponse>> create(
            @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Klien berhasil dibuat", clientService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ClientResponse>>> findAll(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {

        Page<ClientResponse> result = clientService.findAll(search, sortBy, sortDir, page, size);
        String message = result.isEmpty() ? "Data tidak ditemukan" : "OK";
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("OK", clientService.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Klien berhasil diperbarui",
                clientService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        clientService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Klien berhasil dihapus"));
    }
}
