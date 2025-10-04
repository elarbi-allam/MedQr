package com.medqr.backend.dto.error;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponse {
    private final LocalDateTime timestamp = LocalDateTime.now();
    private final int status;
    private final String error; // Nom de l'erreur (ex: Not Found, Forbidden)
    private final String message; // Message détaillé de l'erreur
    private final String path; // Chemin de la requête
}