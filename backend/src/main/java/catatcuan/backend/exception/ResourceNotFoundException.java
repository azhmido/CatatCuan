package catatcuan.backend.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Object id) {
        super(resourceName + " dengan id '" + id + "' tidak ditemukan");
    }
}
