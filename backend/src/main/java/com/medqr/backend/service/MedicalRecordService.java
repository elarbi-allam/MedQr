package com.medqr.backend.service;

import com.medqr.backend.dto.document.DocumentUploadRequest;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.Document;
import com.medqr.backend.model.MedicalRecord;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.DocumentRepository;
import com.medqr.backend.repository.MedicalRecordRepository;
import com.medqr.backend.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository recordRepository;
    private final DocumentRepository documentRepository;
    private final PatientRepository patientRepository; // Doit être créé/injecté
    private final FileStorageService fileStorageService;

    /**
     * Récupère le dossier médical du patient actuellement connecté.
     */
    public MedicalRecord getRecordForCurrentUser() {
        // Récupère l'utilisateur à partir du contexte de sécurité JWT
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Cherche l'entité Patient liée
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        // Cherche le MedicalRecord lié au Patient
        return recordRepository.findByPatient(patient)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé pour le patient."));
    }

    /**
     * Récupère la liste de tous les documents pour le patient connecté.
     */
    public List<Document> getAllDocumentsForCurrentUser() {
        MedicalRecord record = getRecordForCurrentUser();
        return documentRepository.findByMedicalRecordOrderByUploadDateDesc(record);
    }

    /**
     * Téléverse un nouveau document dans le dossier du patient.
     */
    @Transactional
    public Document uploadDocument(DocumentUploadRequest request, MultipartFile file) {
        MedicalRecord record = getRecordForCurrentUser();
        UUID patientId = record.getPatient().getPatientId();

        // 1. Stockage physique du fichier
        String filePath = fileStorageService.storeFile(file, patientId);

        // 2. Enregistrement des métadonnées dans la DB
        Document document = new Document();
        document.setMedicalRecord(record);
        document.setTitle(request.getTitle());
        document.setType(request.getType());
        document.setFilePath(filePath);
        document.setIsFromProvider(false); // Le patient l'a téléversé lui-même

        return documentRepository.save(document);
    }

    /**
     * Charge un document spécifique (pour la visualisation ou le téléchargement)
     */
    public Resource loadDocumentFile(UUID documentId) {
        MedicalRecord record = getRecordForCurrentUser();

        // Vérification de la propriété du document (Sécurité !)
        Document document = documentRepository.findByDocumentIdAndMedicalRecord(documentId, record)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé ou non accessible."));

        // Chargement du fichier
        return fileStorageService.loadFileAsResource(document.getFilePath());
    }

    // *Implémenter ici les méthodes pour créer le dossier lors de l'inscription*
    // Voir PatientService si cela n'est pas déjà fait.
}