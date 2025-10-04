package com.medqr.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper; // Nécessaire pour convertir en JSON
import com.medqr.backend.dto.error.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {

        HttpStatus status = HttpStatus.FORBIDDEN;

        // 1. Créer le DTO d'erreur formaté
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message("Accès non autorisé. Vous ne disposez pas des permissions requises (Rôle insuffisant).")
                .path(request.getRequestURI())
                .build();

        // 2. Configurer la réponse HTTP
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // 3. Écrire le JSON dans le corps de la réponse
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}