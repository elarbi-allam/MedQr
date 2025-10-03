package com.medqr.backend.repository;

import com.medqr.backend.model.HealthcareProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProviderRepository extends JpaRepository<HealthcareProvider, UUID> {
    // Aucune méthode personnalisée nécessaire pour l'instant
}