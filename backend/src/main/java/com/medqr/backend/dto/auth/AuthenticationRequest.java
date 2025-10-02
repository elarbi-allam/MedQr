package com.medqr.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO pour la requête de connexion.
 */
@Data
public class AuthenticationRequest {

    @Email(message = "L'email doit être valide")
    @NotBlank(message = "L'email est requis")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}