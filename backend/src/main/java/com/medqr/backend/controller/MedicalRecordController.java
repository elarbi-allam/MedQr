package com.medqr.backend.controller;

import com.medqr.backend.dto.document.DocumentResponse;
import com.medqr.backend.dto.document.DocumentUploadRequest;
import com.medqr.backend.model.Document;
import com.medqr.backend.service.MedicalRecordService;
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
@RequestMapping("/api/patient/record")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class MedicalRecordController {

    private final MedicalRecordService recordService;

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

    @GetMapping("/documents")
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        List<Document> documents = recordService.getAllDocumentsForCurrentUser();
        List<DocumentResponse> response = documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> uploadDocument(
            @Valid @ModelAttribute DocumentUploadRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le fichier est manquant ou n'est pas un PDF.");
        }

        try {
            Document newDoc = recordService.uploadDocument(request, file);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToDocumentResponse(newDoc));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erreur lors du téléversement.", e);
        }
    }

    @GetMapping("/documents/{documentId}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable UUID documentId) {
        try {
            Resource resource = recordService.loadDocumentFile(documentId);
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
}