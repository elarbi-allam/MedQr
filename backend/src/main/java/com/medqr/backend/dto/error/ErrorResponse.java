package com.medqr.backend.dto.error;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ErrorResponse {
    private final String timestamp = Instant.now().toString();
    private final int status;
    private final String error; // Nom de l'erreur (ex: Not Found, Forbidden)
    private final String message; // Message détaillé de l'erreur
    private final String path; // Chemin de la requête
}