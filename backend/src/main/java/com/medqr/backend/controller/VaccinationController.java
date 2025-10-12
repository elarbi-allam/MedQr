// src/main/java/com/medqr/backend/controller/VaccinationController.java
package com.medqr.backend.controller;

import com.medqr.backend.dto.vaccination.VaccinationRequest;
import com.medqr.backend.dto.vaccination.VaccinationResponse;
import com.medqr.backend.service.VaccinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/vaccinations")
@RequiredArgsConstructor
public class VaccinationController {

    private final VaccinationService vaccinationService;

    /**
     * [PROVIDER] Ajouter une vaccination au dossier d'un patient
     * POST /api/vaccinations/patient/{patientId}
     */
    @PostMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<VaccinationResponse> addVaccination(
            @PathVariable UUID patientId,
            @RequestBody VaccinationRequest request) {

        VaccinationResponse response = vaccinationService.addVaccination(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [PATIENT] Voir toutes mes vaccinations
     * GET /api/vaccinations/my?page=0&size=10
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Page<VaccinationResponse>> getMyVaccinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<VaccinationResponse> vaccinations = vaccinationService.getMyVaccinations(pageable);

        return ResponseEntity.ok(vaccinations);
    }

    /**
     * [PROVIDER] Voir les vaccinations d'un patient
     * GET /api/vaccinations/patient/{patientId}?page=0&size=10
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Page<VaccinationResponse>> getPatientVaccinations(
            @PathVariable UUID patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<VaccinationResponse> vaccinations = vaccinationService
                .getPatientVaccinations(patientId, pageable);

        return ResponseEntity.ok(vaccinations);
    }
}