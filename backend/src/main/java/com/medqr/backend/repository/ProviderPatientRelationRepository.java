package com.medqr.backend.repository;

import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.ProviderPatientRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProviderPatientRelationRepository extends JpaRepository<ProviderPatientRelation, UUID> {

    // Trouver tous les patients d'un provider
    List<ProviderPatientRelation> findByProviderAndIsActiveTrue(HealthcareProvider provider);

    // Vérifier si une relation active existe entre un provider et un patient
    Optional<ProviderPatientRelation> findByProviderAndPatientAndIsActiveTrue(
            HealthcareProvider provider,
            Patient patient
    );

    // Vérifier si un provider a accès à un patient
    boolean existsByProviderAndPatientAndIsActiveTrue(
            HealthcareProvider provider,
            Patient patient
    );
}