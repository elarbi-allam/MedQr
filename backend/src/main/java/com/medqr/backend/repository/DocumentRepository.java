package com.medqr.backend.repository;

import com.medqr.backend.model.Document;
import com.medqr.backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    // Retrouver tous les documents pour un dossier (essentiel pour la liste)
    List<Document> findByMedicalRecordOrderByUploadDateDesc(MedicalRecord medicalRecord);

    // Retrouver un document par ID et par Dossier (sécurité)
    Optional<Document> findByDocumentIdAndMedicalRecord(UUID documentId, MedicalRecord medicalRecord);
}