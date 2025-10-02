package com.medqr.backend.controller;

import com.medqr.backend.dto.auth.AuthenticationRequest;
import com.medqr.backend.dto.auth.AuthenticationResponse;
import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    /**
     * Endpoint pour l'inscription d'un nouvel utilisateur.
     * Accessible à tous.
     */

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        try {
            // Le service ne relance qu'IllegalStateException (utilisateur existant)
            AuthenticationResponse response = authenticationService.register(request);

            // Statut 202 ACCEPTED (l'enregistrement est en attente de vérification)
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);

        } catch (IllegalStateException e) {
            // 409 Conflict pour "L'utilisateur avec cet email existe déjà."
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthenticationResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    /**
     * Endpoint pour la connexion (login).
     * Accessible à tous.
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request
    ) {
        try {
            return ResponseEntity.ok(authenticationService.authenticate(request));
        } catch (AuthenticationException e) {
            // Ne donnez pas trop de détails.
            // Spring Security gère le compte non vérifié (isVerified=false) en levant BadCredentialsException.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
                    .body(AuthenticationResponse.builder()
                            .message("Identifiants ou mot de passe invalides.")
                            .build());
        }
    }

    /**
     * Endpoint pour la vérification de l'email via le code.
     * Accessible à tous.
     */
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("code") String verificationCode) {
        try {
            boolean success = authenticationService.verifyEmail(verificationCode);
            if (success) {
                return ResponseEntity.ok("Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Code de vérification invalide.");
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la vérification.");
        }
    }
}