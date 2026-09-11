package catatcuan.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class AuthResponse {

    private String token;
    private UUID tenantId;
    private String businessName;
    private String email;

    @JsonProperty("tenant")
    public TenantInfo getTenant() {
        return TenantInfo.builder()
                .id(tenantId)
                .name(businessName)
                .tenantName(businessName)
                .email(email)
                .build();
    }

    @Getter
    @Builder
    public static class TenantInfo {
        private UUID id;
        private String name;
        private String tenantName;
        private String email;
    }
}

