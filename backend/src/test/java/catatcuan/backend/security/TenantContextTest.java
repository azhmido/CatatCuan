package catatcuan.backend.security;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;

class TenantContextTest {

    @Test
    void setAndGetShouldReturnCurrentTenantId() {
        UUID tenantId = UUID.randomUUID();

        TenantContext.set(tenantId);

        assertEquals(tenantId, TenantContext.get());
        TenantContext.clear();
    }

    @Test
    void getShouldThrowWhenTenantContextIsNotInitialized() {
        TenantContext.clear();

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                TenantContext::get
        );

        assertEquals("TenantContext is not initialized for this request", exception.getMessage());
    }
}
