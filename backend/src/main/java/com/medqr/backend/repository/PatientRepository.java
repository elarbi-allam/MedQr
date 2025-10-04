package com.medqr.backend.repository;

import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    /**
     * Recherche un Patient par son entité User associée.
     * C'est la méthode qui manquait et qui est nécessaire pour l'accès sécurisé.
     */
    Optional<Patient> findByUser(User user);
}