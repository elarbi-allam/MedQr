package com.medqr.backend.exception;

import com.medqr.backend.dto.error.ErrorResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException; // Pour les 403 de Security
import org.springframework.web.HttpRequestMethodNotSupportedException; // Pour les 405
import org.springframework.web.bind.MethodArgumentNotValidException; // Pour les 400 de validation
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Helper pour créer la réponse d'erreur
    private ErrorResponse buildErrorResponse(HttpStatus status, String error, String message, WebRequest request) {
        return ErrorResponse.builder()
                .status(status.value())
                .error(error)
                .message(message)
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
    }

    // =========================================================================
    // 1. GESTION DES EXCEPTIONS DE SÉCURITÉ ET D'AUTORISATION (4xx)
    // =========================================================================

    /**
     * Gère les 403 Forbidden de Spring Security (utilisateur authentifié mais rôle insuffisant).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        return new ResponseEntity<>(
                buildErrorResponse(status, status.getReasonPhrase(),
                        "Accès refusé. Vous n'avez pas le rôle ou les permissions nécessaires pour cette action.", request),
                status
        );
    }

    /**
     * Gère les 403 Forbidden déclenchés par une logique métier explicite.
     */
    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedActionException(UnauthorizedActionException ex, WebRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        return new ResponseEntity<>(
                buildErrorResponse(status, status.getReasonPhrase(), ex.getMessage(), request),
                status
        );
    }

    // =========================================================================
    // 2. GESTION DES EXCEPTIONS MÉTIER (4xx)
    // =========================================================================

    /**
     * Gère les 404 Not Found (Ressource non trouvée).
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(
                buildErrorResponse(status, status.getReasonPhrase(), ex.getMessage(), request),
                status
        );
    }

    /**
     * Gère les 400 Bad Request pour les erreurs de validation des DTO (@Valid).
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation Error",
                        "Les données fournies ne sont pas valides: " + errors, request),
                HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Gère les 405 Method Not Allowed (Ex: Utiliser GET au lieu de POST).
     */
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase(),
                        "Méthode HTTP non supportée pour cette ressource. Méthodes permises: " + ex.getSupportedHttpMethods(), request),
                HttpStatus.METHOD_NOT_ALLOWED
        );
    }

    // =========================================================================
    // 3. GESTION DES EXCEPTIONS TECHNIQUES (5xx)
    // =========================================================================

    /**
     * Gère les problèmes d'I/O (Input/Output) comme les problèmes de lecture/écriture de fichiers.
     */
    @ExceptionHandler({IOException.class, RuntimeException.class})
    public ResponseEntity<ErrorResponse> handleInternalExceptions(Exception ex, WebRequest request) {
        // En Production, vous ne renverriez pas le message de l'exception technique
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        return new ResponseEntity<>(
                buildErrorResponse(status, status.getReasonPhrase(),
                        "Une erreur inattendue est survenue. Contactez l'administrateur. Détail: " + ex.getLocalizedMessage(), request),
                status
        );
    }
}