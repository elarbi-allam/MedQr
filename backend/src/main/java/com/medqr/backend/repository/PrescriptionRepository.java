// src/main/java/com/medqr/backend/repository/PrescriptionRepository.java
package com.medqr.backend.repository;

import com.medqr.backend.model.Patient;
import com.medqr.backend.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    Page<Prescription> findByPatientOrderByPrescriptionDateDesc(Patient patient, Pageable pageable);

    Page<Prescription> findByPatientAndIsCompletedOrderByPrescriptionDateDesc(Patient patient, Boolean isCompleted, Pageable pageable);

    Optional<Prescription> findByAccessCode(String accessCode);
}