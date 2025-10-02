package com.medqr.backend.dto.auth;

import lombok.Builder;
import lombok.Data;

/**
 * DTO pour la réponse de connexion réussie.
 */
@Data
@Builder
public class AuthenticationResponse {

    private String token;
    private String userType;
    private String message;
}