package com.medqr.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception personnalisée pour gérer les erreurs 404 Not Found.
 * Cette annotation permet à Spring de mapper automatiquement cette exception
 * à une réponse HTTP 404 NOT FOUND.
 */
@ResponseStatus(HttpStatus.NOT_FOUND) // Mappe à un statut HTTP 404
public class ResourceNotFoundException extends RuntimeException {

    // Constructeur simple
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Constructeur avec message et cause (pour envelopper d'autres exceptions)
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}