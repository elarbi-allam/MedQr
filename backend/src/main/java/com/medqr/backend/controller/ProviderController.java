package com.medqr.backend.controller;

import com.medqr.backend.dto.prescription.PrescriptionRequest;
import com.medqr.backend.dto.prescription.PrescriptionResponse;
import com.medqr.backend.model.Prescription;
import com.medqr.backend.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final PrescriptionService prescriptionService;

    // --- Mapper (à mettre dans un mapper dédié dans un projet pro) ---
    private PrescriptionResponse mapToPrescriptionResponse(Prescription prescription) {
        // Créez ce DTO de réponse pour ne pas exposer l'entité complète
        return new PrescriptionResponse(
                prescription.getPrescriptionId(),
                prescription.getPatient().getPatientId(),
                prescription.getProvider().getProviderId(),
                prescription.getDetails(),
                prescription.getPrescriptionDate()
        );
    }

    /**
     * [C] Crée une nouvelle ordonnance pour un patient spécifique.
     * Accessible uniquement par ROLE_PROVIDER (via SecurityConfig)
     */
    @PostMapping("/patients/{patientId}/prescriptions")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @PathVariable UUID patientId,
            @Valid @RequestBody PrescriptionRequest request
    ) {
        Prescription newPrescription = prescriptionService.createPrescription(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToPrescriptionResponse(newPrescription));
    }
}