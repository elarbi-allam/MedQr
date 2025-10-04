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

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient/record")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService recordService;

    // --- Mapper ---
    private DocumentResponse mapToDocumentResponse(Document doc) {
        return DocumentResponse.builder()
                .documentId(doc.getDocumentId())
                .title(doc.getTitle())
                .type(doc.getType())
                .uploadDate(doc.getUploadDate())
                .isFromProvider(doc.getIsFromProvider())
                .build();
    }

    /**
     * [R] Récupère la liste des documents du patient (liste du dossier).
     */
    @GetMapping("/documents")
    // S'assurer que seul le patient peut accéder à ce chemin
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        List<Document> documents = recordService.getAllDocumentsForCurrentUser();
        List<DocumentResponse> response = documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * [C] Téléverse un nouveau document.
     */
    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @Valid @ModelAttribute DocumentUploadRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        // Valider le fichier (taille, type si nécessaire)
        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le fichier est manquant ou n'est pas un PDF.");
        }

        try {
            Document newDoc = recordService.uploadDocument(request, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDocumentResponse(newDoc));
        } catch (Exception e) {
            // Loggez l'exception ici
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors du téléversement.", e);
        }
    }

    /**
     * [R] Consulter un document spécifique (téléchargement ou streaming).
     * @param documentId L'ID du document
     */
    @GetMapping("/documents/{documentId}/view")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Resource> viewDocument(@PathVariable UUID documentId) {
        try {
            Resource resource = recordService.loadDocumentFile(documentId);

            // Tente de déterminer le type MIME (pour le streaming dans le navigateur)
            String contentType = "application/pdf";

            // On peut ajouter un nom de fichier pour le téléchargement
            String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue) // 'inline' pour afficher, 'attachment' pour télécharger
                    .body(resource);

        } catch (Exception e) {
            // Les exceptions (FileNotFoundException, ResourceNotFoundException) sont gérées ici.
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document introuvable ou accès refusé.", e);
        }
    }
}