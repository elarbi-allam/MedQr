package com.medqr.backend.controller;

import com.medqr.backend.dto.profile.*;
import com.medqr.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ========== ENDPOINTS PATIENT ==========

    /**
     * GET /api/profile/patient - Récupère le profil du patient connecté
     */
    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientProfileResponse> getPatientProfile() {
        PatientProfileResponse profile = profileService.getPatientProfile();
        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /api/profile/patient - Met à jour le profil du patient connecté
     */
    @PutMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientProfileResponse> updatePatientProfile(
            @RequestBody PatientProfileUpdateRequest request) {
        PatientProfileResponse updatedProfile = profileService.updatePatientProfile(request);
        return ResponseEntity.ok(updatedProfile);
    }

    // ========== ENDPOINTS PROVIDER ==========

    /**
     * GET /api/profile/provider - Récupère le profil du provider connecté
     */
    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderProfileResponse> getProviderProfile() {
        ProviderProfileResponse profile = profileService.getProviderProfile();
        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /api/profile/provider - Met à jour le profil du provider connecté
     */
    @PutMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderProfileResponse> updateProviderProfile(
            @RequestBody ProviderProfileUpdateRequest request) {
        ProviderProfileResponse updatedProfile = profileService.updateProviderProfile(request);
        return ResponseEntity.ok(updatedProfile);
    }

    // ========== ENDPOINTS FACILITY ==========

    /**
     * GET /api/profile/facility - Récupère le profil de la facility connectée
     */
    @GetMapping("/facility")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<FacilityProfileResponse> getFacilityProfile() {
        FacilityProfileResponse profile = profileService.getFacilityProfile();
        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /api/profile/facility - Met à jour le profil de la facility connectée
     */
    @PutMapping("/facility")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<FacilityProfileResponse> updateFacilityProfile(
            @RequestBody FacilityProfileUpdateRequest request) {
        FacilityProfileResponse updatedProfile = profileService.updateFacilityProfile(request);
        return ResponseEntity.ok(updatedProfile);
    }

    // ========== ENDPOINT CHANGEMENT DE MOT DE PASSE (COMMUN) ==========

    /**
     * POST /api/profile/change-password - Change le mot de passe de l'utilisateur connecté
     */
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request) {
        profileService.changePassword(request);
        return ResponseEntity.ok("Mot de passe modifié avec succès.");
    }
}
