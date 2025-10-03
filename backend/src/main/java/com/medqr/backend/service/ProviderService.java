package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;

    public HealthcareProvider createProvider(User user, RegisterRequest request) {

        // Validation Conditionnelle
        if (!StringUtils.hasText(request.getFirstName()) || !StringUtils.hasText(request.getLastName())) {
            throw new IllegalStateException("Le prénom et nom du professionnel de santé sont requis.");
        }
        if (!StringUtils.hasText(request.getLicenseNumber())) {
            throw new IllegalStateException("Le numéro de licence est requis pour un professionnel.");
        }

        // Création et mapping
        HealthcareProvider provider = new HealthcareProvider();
        provider.setUser(user);
        provider.setFirstName(request.getFirstName());
        provider.setLastName(request.getLastName());
        provider.setSpecialty(request.getSpecialty());
        provider.setPhoneNumber(request.getPhoneNumber());
        provider.setLicenseNumber(request.getLicenseNumber());

        return providerRepository.save(provider);
    }
}