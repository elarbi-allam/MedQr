package com.medqr.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception utilisée spécifiquement pour indiquer qu'un fichier
 * physique (document) n'a pas été trouvé. Mappée à 404 NOT FOUND.
 */
@ResponseStatus(HttpStatus.NOT_FOUND) // Mappe à un statut HTTP 404
public class FileNotFoundException extends RuntimeException {

    public FileNotFoundException(String message) {
        super(message);
    }

    public FileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}