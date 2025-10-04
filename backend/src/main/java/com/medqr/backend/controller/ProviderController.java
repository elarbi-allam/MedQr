package com.medqr.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur simplifié pour les providers.
 * Les fonctionnalités de prescription sont maintenant dans ProviderMedicalRecordController.
 */
@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderController {

    // Ce contrôleur peut contenir d'autres endpoints spécifiques aux providers
    // comme la gestion de leur profil, leurs disponibilités, etc.

    @GetMapping("/profile")
    public ResponseEntity<String> getProfile() {
        return ResponseEntity.ok("Provider profile endpoint");
    }
}