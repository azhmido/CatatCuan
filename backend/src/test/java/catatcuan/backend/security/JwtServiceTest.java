package catatcuan.backend.security;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService(
            "catatcuan-test-secret-key-256bit-or-longer",
            3_600_000L
    );

    @Test
    void generateTokenShouldRoundTripSubjectAndTenantId() {
        UUID tenantId = UUID.randomUUID();

        String token = jwtService.generateToken("user@example.com", tenantId);

        assertEquals("user@example.com", jwtService.extractEmail(token));
        assertEquals(tenantId, jwtService.extractTenantId(token));
        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void invalidTokenShouldBeRejected() {
        assertFalse(jwtService.isTokenValid("not-a-valid-jwt-token"));
    }
}
