package catatcuan.backend.dto.response;

import catatcuan.backend.entity.Client;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class ClientResponse {

    private UUID id;
    private String name;
    private String contact;
    private String address;
    private Instant createdAt;
    private Instant updatedAt;

    public static ClientResponse from(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .name(client.getName())
                .contact(client.getContact())
                .address(client.getAddress())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }
}
