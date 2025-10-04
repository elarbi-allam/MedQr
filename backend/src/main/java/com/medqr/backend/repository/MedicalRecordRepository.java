package com.medqr.backend.repository;

import com.medqr.backend.model.MedicalRecord;
import com.medqr.backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    // Méthode clé pour retrouver le dossier par le Patient
    Optional<MedicalRecord> findByPatient(Patient patient);
}