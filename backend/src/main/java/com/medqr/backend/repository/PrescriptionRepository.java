package com.medqr.backend.repository;

import com.medqr.backend.model.Patient;
import com.medqr.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    // Trouver toutes les prescriptions d'un patient
    List<Prescription> findByPatientOrderByPrescriptionDateDesc(Patient patient);
}