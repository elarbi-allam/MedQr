// src/main/java/com/medqr/backend/controller/MedicationController.java
package com.medqr.backend.controller;

import com.medqr.backend.dto.medication.MedicationRequest;
import com.medqr.backend.dto.medication.MedicationResponse;
import com.medqr.backend.service.MedicationService;
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
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;

    /**
     * [PROVIDER] Ajouter un médicament au dossier d'un patient
     * POST /api/medications/patient/{patientId}
     */
    @PostMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<MedicationResponse> addMedication(
            @PathVariable UUID patientId,
            @RequestBody MedicationRequest request) {

        MedicationResponse response = medicationService.addMedication(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [PATIENT] Voir tous mes médicaments
     * GET /api/medications/my?currentOnly=true&page=0&size=10
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Page<MedicationResponse>> getMyMedications(
            @RequestParam(required = false) Boolean currentOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<MedicationResponse> medications = medicationService.getMyMedications(pageable, currentOnly);

        return ResponseEntity.ok(medications);
    }

    /**
     * [PROVIDER] Voir les médicaments d'un patient
     * GET /api/medications/patient/{patientId}?currentOnly=true&page=0&size=10
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Page<MedicationResponse>> getPatientMedications(
            @PathVariable UUID patientId,
            @RequestParam(required = false) Boolean currentOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<MedicationResponse> medications = medicationService
                .getPatientMedications(patientId, pageable, currentOnly);

        return ResponseEntity.ok(medications);
    }

    /**
     * [PROVIDER] Mettre à jour un médicament
     * PUT /api/medications/{medicationId}
     */
    @PutMapping("/{medicationId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<MedicationResponse> updateMedication(
            @PathVariable UUID medicationId,
            @RequestBody MedicationRequest request) {

        MedicationResponse response = medicationService.updateMedication(medicationId, request);
        return ResponseEntity.ok(response);
    }
}