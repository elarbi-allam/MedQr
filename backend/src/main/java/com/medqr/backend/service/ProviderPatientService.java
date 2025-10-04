package com.medqr.backend.service;

import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.exception.UnauthorizedException;
import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.ProviderPatientRelation;
import com.medqr.backend.repository.ProviderPatientRelationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderPatientService {

    private final ProviderPatientRelationRepository relationRepository;
    private final ProviderService providerService;
    private final PatientService patientService;

    /**
     * Crée une relation entre un provider et un patient.
     * Généralement appelé lors d'une première consultation ou via un code QR.
     */
    @Transactional
    public ProviderPatientRelation createRelation(UUID providerId, UUID patientId, String relationshipType) {
        HealthcareProvider provider = providerService.getProviderByUserId(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider non trouvé."));

        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        // Vérifier si la relation existe déjà
        Optional<ProviderPatientRelation> existing = relationRepository
                .findByProviderAndPatientAndIsActiveTrue(provider, patient);

        if (existing.isPresent()) {
            return existing.get(); // Retourner la relation existante
        }

        // Créer nouvelle relation
        ProviderPatientRelation relation = new ProviderPatientRelation();
        relation.setProvider(provider);
        relation.setPatient(patient);
        relation.setRelationshipType(relationshipType);
        relation.setIsActive(true);

        return relationRepository.save(relation);
    }

    /**
     * Récupère tous les patients d'un provider.
     */
    public List<Patient> getPatientsForCurrentProvider() {
        HealthcareProvider provider = providerService.getCurrentProvider();

        return relationRepository.findByProviderAndIsActiveTrue(provider)
                .stream()
                .map(ProviderPatientRelation::getPatient)
                .collect(Collectors.toList());
    }

    /**
     * Vérifie si le provider actuel a accès à un patient spécifique.
     */
    public boolean hasAccessToPatient(UUID patientId) {
        HealthcareProvider provider = providerService.getCurrentProvider();
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        return relationRepository.existsByProviderAndPatientAndIsActiveTrue(provider, patient);
    }

    /**
     * Vérifie l'accès et lève une exception si non autorisé.
     */
    public void verifyAccessToPatient(UUID patientId) {
        if (!hasAccessToPatient(patientId)) {
            throw new UnauthorizedException("Vous n'avez pas accès au dossier de ce patient.");
        }
    }
}