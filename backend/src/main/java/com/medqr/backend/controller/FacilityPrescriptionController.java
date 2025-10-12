// src/main/java/com/medqr/backend/controller/FacilityPrescriptionController.java
package com.medqr.backend.controller;

import com.medqr.backend.dto.prescription.FacilityAccessCodeResponse;
import com.medqr.backend.dto.prescription.FacilityPrescriptionRequestRequest;
import com.medqr.backend.dto.prescription.FacilityPrescriptionRequestResponse;
import com.medqr.backend.dto.prescription.PrescriptionDetailResponse;
import org.springframework.core.io.Resource;
import com.medqr.backend.service.FacilityPrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/facility-prescriptions")
@RequiredArgsConstructor
public class FacilityPrescriptionController {

    private final FacilityPrescriptionService facilityPrescriptionService;

    /**
     * [PATIENT] Générer un code QR pour une ordonnance
     */
    @PostMapping("/generate-code")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<FacilityAccessCodeResponse> generateCode(@RequestParam UUID prescriptionId) {
        FacilityAccessCodeResponse response = facilityPrescriptionService.generateAccessCodeForPrescription(prescriptionId);
        return ResponseEntity.ok(response);
    }

    /**
     * [FACILITY] Scanner le code et faire une demande
     */
    @PostMapping("/scan-code")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<String> scanCodeAndRequest(
            @RequestParam String code,
            @RequestBody FacilityPrescriptionRequestRequest request) {

        String message = facilityPrescriptionService.requestAccessToPrescription(code, request);
        return ResponseEntity.ok(message);
    }

    /**
     * [PATIENT] Voir toutes mes demandes en attente
     */
    @GetMapping("/my-pending-requests")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Page<FacilityPrescriptionRequestResponse>> getMyPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(facilityPrescriptionService.getMyPendingRequests(pageable));
    }

    /**
     * [PATIENT] Voir toutes les demandes pour une ordonnance spécifique
     */
    @GetMapping("/prescription/{prescriptionId}/requests")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<FacilityPrescriptionRequestResponse>> getRequestsForPrescription(@PathVariable UUID prescriptionId) {
        return ResponseEntity.ok(facilityPrescriptionService.getRequestsForPrescription(prescriptionId));
    }

    /**
     * [PATIENT] Approuver une demande
     */
    @PutMapping("/approve/{requestId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> approveRequest(@PathVariable UUID requestId) {
        return ResponseEntity.ok(facilityPrescriptionService.approveFacilityRequest(requestId));
    }

    /**
     * [PATIENT] Rejeter une demande
     */
    @PutMapping("/reject/{requestId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> rejectRequest(@PathVariable UUID requestId) {
        return ResponseEntity.ok(facilityPrescriptionService.rejectFacilityRequest(requestId));
    }

    /**
     * [FACILITY] Télécharger le PDF de l'ordonnance
     */
    @GetMapping("/{requestId}/prescription")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<Resource> viewPrescriptionDocument(@PathVariable UUID requestId) {
        Resource resource = facilityPrescriptionService.viewPrescriptionDocument(requestId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * [FACILITY] Voir l'ordonnance approuvée
     */
    @GetMapping("/{requestId}/prescription/details")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<PrescriptionDetailResponse> viewPrescription(@PathVariable UUID requestId) {
        PrescriptionDetailResponse response = facilityPrescriptionService.viewPrescription(requestId);
        return ResponseEntity.ok(response);
    }

    /**
     * [FACILITY] Ajouter le résultat
     */
    @PostMapping("/{requestId}/result")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<String> uploadResult(
            @PathVariable UUID requestId,
            @RequestParam String documentTitle,
            @RequestParam("file") MultipartFile file) {

        String message = facilityPrescriptionService.uploadPrescriptionResult(requestId, documentTitle, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    /**
     * [FACILITY] Voir mes demandes approuvées
     */
    @GetMapping("/my-approved")
    @PreAuthorize("hasRole('FACILITY')")
    public ResponseEntity<Page<FacilityPrescriptionRequestResponse>> getMyApprovedRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(facilityPrescriptionService.getMyApprovedRequests(pageable));
    }
}