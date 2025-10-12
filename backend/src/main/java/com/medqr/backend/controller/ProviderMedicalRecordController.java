// src/main/java/com/medqr/backend/controller/ProviderMedicalRecordController.java (MISE À JOUR)
package com.medqr.backend.controller;

import com.medqr.backend.dto.document.DocumentResponse;
import com.medqr.backend.dto.patient.PatientSummaryResponse;
import com.medqr.backend.dto.prescription.PrescriptionCreateRequest;
import com.medqr.backend.dto.prescription.PrescriptionResponse;
import com.medqr.backend.enums.DocumentType;
import com.medqr.backend.model.Document;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.Prescription;
import com.medqr.backend.service.MedicalRecordService;
import com.medqr.backend.service.PrescriptionService;
import com.medqr.backend.service.ProviderPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provider/patients")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderMedicalRecordController {

    private final ProviderPatientService providerPatientService;
    private final MedicalRecordService medicalRecordService;
    private final PrescriptionService prescriptionService;

    /**
     * Lister mes patients
     * GET /api/provider/patients
     */
    @GetMapping
    public ResponseEntity<List<PatientSummaryResponse>> getMyPatients() {
        List<Patient> patients = providerPatientService.getPatientsForCurrentProvider();

        List<PatientSummaryResponse> response = patients.stream()
                .map(p -> PatientSummaryResponse.builder()
                        .patientId(p.getPatientId())
                        .firstName(p.getFirstName())
                        .lastName(p.getLastName())
                        .dateOfBirth(p.getDateOfBirth())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Voir les documents d'un patient avec pagination
     * GET /api/provider/patients/{patientId}/documents?type=ANALYSIS&page=0&size=10
     */
    @GetMapping("/{patientId}/documents")
    public ResponseEntity<Page<DocumentResponse>> getPatientDocuments(
            @PathVariable UUID patientId,
            @RequestParam(required = false) DocumentType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Document> documents = medicalRecordService.getAllDocumentsForPatient(patientId, type, pageable);

        Page<DocumentResponse> response = documents.map(doc -> DocumentResponse.builder()
                .documentId(doc.getDocumentId())
                .title(doc.getTitle())
                .type(doc.getType())
                .uploadDate(doc.getUploadDate())
                .source(doc.getSource())
                .uploaderId(doc.getUploaderId())
                .build());

        return ResponseEntity.ok(response);
    }

    /**
     * Visualiser un document d'un patient
     * GET /api/provider/patients/{patientId}/documents/{documentId}/view
     */
    @GetMapping("/{patientId}/documents/{documentId}/view")
    public ResponseEntity<Resource> viewPatientDocument(
            @PathVariable UUID patientId,
            @PathVariable UUID documentId) {

        Resource resource = medicalRecordService.loadDocumentFileForProvider(documentId, patientId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * Créer une ordonnance
     * POST /api/provider/patients/{patientId}/prescriptions
     */
    @PostMapping("/{patientId}/prescriptions")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @PathVariable UUID patientId,
            @RequestParam String documentTitle,
            @RequestParam DocumentType documentType,
            @RequestParam String details,
            @RequestParam("file") MultipartFile file) {

        PrescriptionCreateRequest request = new PrescriptionCreateRequest();
        request.setDocumentTitle(documentTitle);
        request.setDocumentType(documentType);
        request.setDetails(details);

        Prescription prescription = prescriptionService.createPrescription(patientId, request, file);

        PrescriptionResponse response = PrescriptionResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .patientId(prescription.getPatient().getPatientId())
                .providerId(prescription.getProvider().getProviderId())
                .details(prescription.getDetails())
                .prescriptionDate(prescription.getPrescriptionDate())
                .relatedDocumentId(prescription.getRelatedDocument().getDocumentId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Voir toutes les ordonnances d'un patient avec pagination
     * GET /api/provider/patients/{patientId}/prescriptions?isCompleted=false&page=0&size=10
     */
    @GetMapping("/{patientId}/prescriptions")
    public ResponseEntity<Page<PrescriptionResponse>> getPatientPrescriptions(
            @PathVariable UUID patientId,
            @RequestParam(required = false) Boolean isCompleted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Prescription> prescriptions = prescriptionService.getPrescriptionsForPatient(patientId, isCompleted, pageable);

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

    /**
     * Marquer une ordonnance comme réalisée
     * PUT /api/provider/prescriptions/{prescriptionId}/complete
     */
    @PutMapping("/prescriptions/{prescriptionId}/complete")
    public ResponseEntity<PrescriptionResponse> completePrescription(@PathVariable UUID prescriptionId) {
        Prescription prescription = prescriptionService.markPrescriptionAsCompleted(prescriptionId);

        PrescriptionResponse response = PrescriptionResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .patientId(prescription.getPatient().getPatientId())
                .providerId(prescription.getProvider().getProviderId())
                .details(prescription.getDetails())
                .prescriptionDate(prescription.getPrescriptionDate())
                .relatedDocumentId(prescription.getRelatedDocument().getDocumentId())
                .build();

        return ResponseEntity.ok(response);
    }
}