// src/main/java/com/medqr/backend/controller/MedicalRecordController.java (MISE À JOUR)
package com.medqr.backend.controller;

import com.medqr.backend.dto.document.DocumentResponse;
import com.medqr.backend.dto.document.DocumentUploadRequest;
import com.medqr.backend.enums.DocumentType;
import com.medqr.backend.model.Document;
import com.medqr.backend.service.MedicalRecordService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/patient/record")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    /**
     * Lister mes documents avec pagination
     * GET /api/patient/record/documents?type=ANALYSIS&page=0&size=10
     */
    @GetMapping("/documents")
    public ResponseEntity<Page<DocumentResponse>> getMyDocuments(
            @RequestParam(required = false) DocumentType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Document> documents = medicalRecordService.getAllDocumentsForCurrentUser(type, pageable);

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
     * Téléverser un document
     * POST /api/patient/record/documents
     */
    @PostMapping("/documents")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @RequestParam String title,
            @RequestParam DocumentType type,
            @RequestParam("file") MultipartFile file) {

        DocumentUploadRequest request = new DocumentUploadRequest();
        request.setTitle(title);
        request.setType(type);

        Document document = medicalRecordService.uploadDocument(request, file);

        DocumentResponse response = DocumentResponse.builder()
                .documentId(document.getDocumentId())
                .title(document.getTitle())
                .type(document.getType())
                .uploadDate(document.getUploadDate())
                .source(document.getSource())
                .uploaderId(document.getUploaderId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Visualiser un document
     * GET /api/patient/record/documents/{documentId}/view
     */
    @GetMapping("/documents/{documentId}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable UUID documentId) {
        Resource resource = medicalRecordService.loadDocumentFile(documentId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}