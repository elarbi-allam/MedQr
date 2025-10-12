// src/main/java/com/medqr/backend/service/MedicalRecordService.java (MISE À JOUR)
package com.medqr.backend.service;

import com.medqr.backend.dto.document.DocumentUploadRequest;
import com.medqr.backend.enums.DocumentSource;
import com.medqr.backend.enums.DocumentType;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.Document;
import com.medqr.backend.model.MedicalRecord;
import com.medqr.backend.model.Patient;
import com.medqr.backend.repository.DocumentRepository;
import com.medqr.backend.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository recordRepository;
    private final DocumentRepository documentRepository;
    private final FileStorageService fileStorageService;
    private final PatientService patientService;

    public MedicalRecord getRecordForCurrentUser() {
        Patient patient = patientService.getCurrentPatient();
        return recordRepository.findByPatient(patient)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé."));
    }

    public MedicalRecord getRecordByPatientId(UUID patientId) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));
        return recordRepository.findByPatient(patient)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé."));
    }

    // NOUVELLE: Pagination
    public Page<Document> getAllDocumentsForCurrentUser(Pageable pageable) {
        MedicalRecord record = getRecordForCurrentUser();
        return documentRepository.findByMedicalRecordOrderByUploadDateDesc(record, pageable);
    }

    // NOUVELLE: Pagination avec filtre par type
    public Page<Document> getAllDocumentsForCurrentUser(DocumentType type, Pageable pageable) {
        MedicalRecord record = getRecordForCurrentUser();
        if (type != null) {
            return documentRepository.findByMedicalRecordAndTypeOrderByUploadDateDesc(record, type, pageable);
        }
        return documentRepository.findByMedicalRecordOrderByUploadDateDesc(record, pageable);
    }

    // NOUVELLE: Pagination
    public Page<Document> getAllDocumentsForPatient(UUID patientId, Pageable pageable) {
        MedicalRecord record = getRecordByPatientId(patientId);
        return documentRepository.findByMedicalRecordOrderByUploadDateDesc(record, pageable);
    }

    // NOUVELLE: Pagination avec filtre par type
    public Page<Document> getAllDocumentsForPatient(UUID patientId, DocumentType type, Pageable pageable) {
        MedicalRecord record = getRecordByPatientId(patientId);
        if (type != null) {
            return documentRepository.findByMedicalRecordAndTypeOrderByUploadDateDesc(record, type, pageable);
        }
        return documentRepository.findByMedicalRecordOrderByUploadDateDesc(record, pageable);
    }

    @Transactional
    public Document uploadDocument(DocumentUploadRequest request, MultipartFile file) {
        MedicalRecord record = getRecordForCurrentUser();
        Patient patient = patientService.getCurrentPatient();

        String filePath = fileStorageService.storeFile(file, patient.getPatientId());

        Document document = new Document();
        document.setMedicalRecord(record);
        document.setTitle(request.getTitle());
        document.setType(request.getType());
        document.setFilePath(filePath);
        document.setUploader(DocumentSource.PATIENT, patient.getPatientId());

        return documentRepository.save(document);
    }

    public Resource loadDocumentFile(UUID documentId) {
        MedicalRecord record = getRecordForCurrentUser();
        Document document = documentRepository.findByDocumentIdAndMedicalRecord(documentId, record)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé."));

        return fileStorageService.loadFileAsResource(document.getFilePath());
    }

    public Resource loadDocumentFileForProvider(UUID documentId, UUID patientId) {
        MedicalRecord record = getRecordByPatientId(patientId);
        Document document = documentRepository.findByDocumentIdAndMedicalRecord(documentId, record)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé."));

        return fileStorageService.loadFileAsResource(document.getFilePath());
    }
}