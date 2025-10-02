package com.medqr.backend.repository;

import com.medqr.backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    // Aucune méthode spécifique nécessaire pour l'instant, JpaRepository suffit
}