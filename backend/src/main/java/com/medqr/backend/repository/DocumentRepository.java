// src/main/java/com/medqr/backend/repository/DocumentRepository.java
package com.medqr.backend.repository;

import com.medqr.backend.enums.DocumentType;
import com.medqr.backend.model.Document;
import com.medqr.backend.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    Page<Document> findByMedicalRecordOrderByUploadDateDesc(MedicalRecord medicalRecord, Pageable pageable);

    Page<Document> findByMedicalRecordAndTypeOrderByUploadDateDesc(MedicalRecord medicalRecord, DocumentType type, Pageable pageable);

    Optional<Document> findByDocumentIdAndMedicalRecord(UUID documentId, MedicalRecord medicalRecord);
}