package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.ProviderRepository;
import com.medqr.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;

    public HealthcareProvider createProvider(User user, RegisterRequest request) {
        // Validation
        if (!StringUtils.hasText(request.getFirstName()) || !StringUtils.hasText(request.getLastName())) {
            throw new IllegalStateException("Le prénom et nom du professionnel de santé sont requis.");
        }
        if (!StringUtils.hasText(request.getLicenseNumber())) {
            throw new IllegalStateException("Le numéro de licence est requis pour un professionnel.");
        }

        // Création
        HealthcareProvider provider = new HealthcareProvider();
        provider.setUser(user);
        provider.setFirstName(request.getFirstName());
        provider.setLastName(request.getLastName());
        provider.setSpecialty(request.getSpecialty());
        provider.setPhoneNumber(request.getPhoneNumber());
        provider.setLicenseNumber(request.getLicenseNumber());

        return providerRepository.save(provider);
    }

    /**
     * Récupère un Provider par son User ID.
     */
    public Optional<HealthcareProvider> getProviderByUserId(UUID userId) {
        // Note: Cette méthode nécessite de trouver d'abord le User, puis le Provider
        // Pour simplifier, on peut ajouter une méthode dans le repository
        return providerRepository.findById(userId);
    }

    /**
     * Récupère un Provider par son User.
     */
    public Optional<HealthcareProvider> getProviderByUser(User user) {
        return providerRepository.findByUser(user);
    }

    /**
     * Récupère le Provider actuellement connecté.
     */
    public HealthcareProvider getCurrentProvider() {
        User currentUser = SecurityUtils.getCurrentUser();
        return providerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Provider non trouvé pour l'utilisateur connecté."));
    }
}