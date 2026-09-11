package catatcuan.backend.dto.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiResponseTest {

    @Test
    void successWithDataShouldPopulateMetadataAndPayload() {
        ApiResponse<String> response = ApiResponse.success("OK", "ready");

        assertTrue(response.isSuccess());
        assertEquals("OK", response.getMessage());
        assertEquals("ready", response.getData());
    }

    @Test
    void successWithoutDataShouldReturnNullPayload() {
        ApiResponse<String> response = ApiResponse.success("Created");

        assertTrue(response.isSuccess());
        assertEquals("Created", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void errorShouldReturnFailureMetadata() {
        ApiResponse<String> response = ApiResponse.error("Bad request");

        assertFalse(response.isSuccess());
        assertEquals("Bad request", response.getMessage());
        assertNull(response.getData());
    }
}
