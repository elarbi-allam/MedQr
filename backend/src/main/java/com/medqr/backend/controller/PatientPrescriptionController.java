// src/main/java/com/medqr/backend/controller/PatientPrescriptionController.java
package com.medqr.backend.controller;

import com.medqr.backend.dto.prescription.PrescriptionResponse;
import com.medqr.backend.model.Prescription;
import com.medqr.backend.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient/prescriptions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientPrescriptionController {

    private final PrescriptionService prescriptionService;

    /**
     * [PATIENT] Voir mes ordonnances avec pagination
     * GET /api/patient/prescriptions?isCompleted=false&page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<PrescriptionResponse>> getMyPrescriptions(
            @RequestParam(required = false) Boolean isCompleted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Prescription> prescriptions = prescriptionService.getMyPrescriptions(isCompleted, pageable);

        Page<PrescriptionResponse> response = prescriptions.map(p -> PrescriptionResponse.builder()
                .prescriptionId(p.getPrescriptionId())
                .patientId(p.getPatient().getPatientId())
                .providerId(p.getProvider().getProviderId())
                .details(p.getDetails())
                .prescriptionDate(p.getPrescriptionDate())
                .relatedDocumentId(p.getRelatedDocument().getDocumentId())
                .build());

        return ResponseEntity.ok(response);
    }
}