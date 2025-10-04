package com.medqr.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medqr.backend.dto.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {

        HttpStatus status = HttpStatus.UNAUTHORIZED;

        // 1. Créer le DTO d'erreur formaté (401 Unauthorized)
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(status.value())
                .error("Unauthorized")
                .message("Token JWT manquant, invalide ou expiré. Veuillez vous connecter à nouveau.")
                .path(request.getRequestURI())
                .build();

        // 2. Configurer la réponse HTTP
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // 3. Écrire le JSON dans le corps de la réponse
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}