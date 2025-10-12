// src/main/java/com/medqr/backend/repository/MedicationRepository.java
package com.medqr.backend.repository;

import com.medqr.backend.model.Medication;
import com.medqr.backend.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, UUID> {

    Page<Medication> findByMedicalRecordOrderByStartDateDesc(MedicalRecord medicalRecord, Pageable pageable);

    Page<Medication> findByMedicalRecordAndIsCurrentTrueOrderByStartDateDesc(MedicalRecord medicalRecord, Pageable pageable);
}