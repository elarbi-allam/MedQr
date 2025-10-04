package com.medqr.backend.controller;

import com.medqr.backend.dto.document.DocumentResponse;
import com.medqr.backend.dto.patient.PatientSummaryResponse;
import com.medqr.backend.dto.prescription.PrescriptionCreateRequest;
import com.medqr.backend.dto.prescription.PrescriptionResponse;
import com.medqr.backend.model.Document;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.Prescription;
import com.medqr.backend.service.MedicalRecordService;
import com.medqr.backend.service.PrescriptionService;
import com.medqr.backend.service.ProviderPatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provider/patients")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderMedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final PrescriptionService prescriptionService;
    private final ProviderPatientService providerPatientService;

    private DocumentResponse mapToDocumentResponse(Document doc) {
        return DocumentResponse.builder()
                .documentId(doc.getDocumentId())
                .title(doc.getTitle())
                .type(doc.getType())
                .uploadDate(doc.getUploadDate())
                .source(doc.getSource())
                .uploaderId(doc.getUploaderId())
                .build();
    }

    private PrescriptionResponse mapToPrescriptionResponse(Prescription prescription) {
        return new PrescriptionResponse(
                prescription.getPrescriptionId(),
                prescription.getPatient().getPatientId(),
                prescription.getProvider().getProviderId(),
                prescription.getDetails(),
                prescription.getPrescriptionDate(),
                prescription.getRelatedDocument().getDocumentId()
        );
    }

    @GetMapping
    public ResponseEntity<List<PatientSummaryResponse>> getMyPatients() {
        List<Patient> patients = providerPatientService.getPatientsForCurrentProvider();

        List<PatientSummaryResponse> response = patients.stream()
                .map(p -> new PatientSummaryResponse(
                        p.getPatientId(),
                        p.getFirstName(),
                        p.getLastName(),
                        p.getDateOfBirth()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/documents")
    public ResponseEntity<List<DocumentResponse>> getPatientDocuments(@PathVariable UUID patientId) {
        providerPatientService.verifyAccessToPatient(patientId);
        List<Document> documents = medicalRecordService.getAllDocumentsForPatient(patientId);

        List<DocumentResponse> response = documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{patientId}/documents/{documentId}/view")
    public ResponseEntity<Resource> viewPatientDocument(
            @PathVariable UUID patientId,
            @PathVariable UUID documentId
    ) {
        try {
            providerPatientService.verifyAccessToPatient(patientId);
            Resource resource = medicalRecordService.loadDocumentFileForProvider(documentId, patientId);

            String contentType = "application/pdf";
            String headerValue = "inline; filename=\"" + resource.getFilename() + "\"";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(resource);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Document introuvable.", e);
        }
    }

    @PostMapping(value = "/{patientId}/prescriptions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @PathVariable UUID patientId,
            @Valid @ModelAttribute PrescriptionCreateRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le fichier PDF de l'ordonnance est requis.");
        }

        Prescription prescription = prescriptionService.createPrescription(patientId, request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToPrescriptionResponse(prescription));
    }

    @GetMapping("/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(@PathVariable UUID patientId) {
        providerPatientService.verifyAccessToPatient(patientId);

        List<Prescription> prescriptions = prescriptionService.getPrescriptionsForPatient(patientId);

        List<PrescriptionResponse> response = prescriptions.stream()
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/prescriptions/{prescriptionId}/complete")
    public ResponseEntity<PrescriptionResponse> markPrescriptionComplete(@PathVariable UUID prescriptionId) {
        Prescription prescription = prescriptionService.markPrescriptionAsCompleted(prescriptionId);
        return ResponseEntity.ok(mapToPrescriptionResponse(prescription));
    }
}