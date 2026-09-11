package catatcuan.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum InvoiceStatus {
    DRAFT,
    SENT,
    PAID,
    OVERDUE;

    @JsonCreator
    public static InvoiceStatus fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return switch (value.trim().toUpperCase()) {
            case "DRAFT" -> DRAFT;
            case "SENT", "TERKIRIM" -> SENT;
            case "PAID", "LUNAS" -> PAID;
            case "OVERDUE", "TELAT" -> OVERDUE;
            default -> throw new IllegalArgumentException("Unknown invoice status: " + value);
        };
    }
}

