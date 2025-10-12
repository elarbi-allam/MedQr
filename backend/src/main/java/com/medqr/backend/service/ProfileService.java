package com.medqr.backend.service;

import com.medqr.backend.dto.profile.*;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.exception.UnauthorizedException;
import com.medqr.backend.model.Facility;
import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.FacilityRepository;
import com.medqr.backend.repository.PatientRepository;
import com.medqr.backend.repository.ProviderRepository;
import com.medqr.backend.repository.UserRepository;
import com.medqr.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final PatientRepository patientRepository;
    private final ProviderRepository providerRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ========== PATIENT PROFILE ==========

    /**
     * Récupère le profil du patient connecté
     */
    public PatientProfileResponse getPatientProfile() {
        User currentUser = SecurityUtils.getCurrentUser();
        Patient patient = patientRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé"));

        return PatientProfileResponse.builder()
                .patientId(patient.getPatientId())
                .email(currentUser.getEmail())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .phoneNumber(patient.getPhoneNumber())
                .address(patient.getAddress())
                .build();
    }

    /**
     * Met à jour le profil du patient connecté
     */
    @Transactional
    public PatientProfileResponse updatePatientProfile(PatientProfileUpdateRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        Patient patient = patientRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé"));

        // Validation
        if (StringUtils.hasText(request.getFirstName())) {
            patient.setFirstName(request.getFirstName());
        }
        if (StringUtils.hasText(request.getLastName())) {
            patient.setLastName(request.getLastName());
        }
        if (request.getDateOfBirth() != null) {
            patient.setDateOfBirth(request.getDateOfBirth());
        }
        if (StringUtils.hasText(request.getPhoneNumber())) {
            patient.setPhoneNumber(request.getPhoneNumber());
        }
        if (StringUtils.hasText(request.getAddress())) {
            patient.setAddress(request.getAddress());
        }

        Patient updatedPatient = patientRepository.save(patient);

        return PatientProfileResponse.builder()
                .patientId(updatedPatient.getPatientId())
                .email(currentUser.getEmail())
                .firstName(updatedPatient.getFirstName())
                .lastName(updatedPatient.getLastName())
                .dateOfBirth(updatedPatient.getDateOfBirth())
                .phoneNumber(updatedPatient.getPhoneNumber())
                .address(updatedPatient.getAddress())
                .build();
    }

    // ========== PROVIDER PROFILE ==========

    /**
     * Récupère le profil du provider connecté
     */
    public ProviderProfileResponse getProviderProfile() {
        User currentUser = SecurityUtils.getCurrentUser();
        HealthcareProvider provider = providerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Provider non trouvé"));

        return ProviderProfileResponse.builder()
                .providerId(provider.getProviderId())
                .email(currentUser.getEmail())
                .firstName(provider.getFirstName())
                .lastName(provider.getLastName())
                .specialty(provider.getSpecialty())
                .phoneNumber(provider.getPhoneNumber())
                .licenseNumber(provider.getLicenseNumber())
                .build();
    }

    /**
     * Met à jour le profil du provider connecté
     */
    @Transactional
    public ProviderProfileResponse updateProviderProfile(ProviderProfileUpdateRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        HealthcareProvider provider = providerRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Provider non trouvé"));

        // Validation et mise à jour
        if (StringUtils.hasText(request.getFirstName())) {
            provider.setFirstName(request.getFirstName());
        }
        if (StringUtils.hasText(request.getLastName())) {
            provider.setLastName(request.getLastName());
        }
        if (StringUtils.hasText(request.getSpecialty())) {
            provider.setSpecialty(request.getSpecialty());
        }
        if (StringUtils.hasText(request.getPhoneNumber())) {
            provider.setPhoneNumber(request.getPhoneNumber());
        }
        if (StringUtils.hasText(request.getLicenseNumber())) {
            // Vérifier que le nouveau numéro de licence n'existe pas déjà
            if (!request.getLicenseNumber().equals(provider.getLicenseNumber())) {
                providerRepository.findByLicenseNumber(request.getLicenseNumber())
                        .ifPresent(existing -> {
                            throw new IllegalStateException("Ce numéro de licence est déjà utilisé.");
                        });
            }
            provider.setLicenseNumber(request.getLicenseNumber());
        }

        HealthcareProvider updatedProvider = providerRepository.save(provider);

        return ProviderProfileResponse.builder()
                .providerId(updatedProvider.getProviderId())
                .email(currentUser.getEmail())
                .firstName(updatedProvider.getFirstName())
                .lastName(updatedProvider.getLastName())
                .specialty(updatedProvider.getSpecialty())
                .phoneNumber(updatedProvider.getPhoneNumber())
                .licenseNumber(updatedProvider.getLicenseNumber())
                .build();
    }

    // ========== FACILITY PROFILE ==========

    /**
     * Récupère le profil de la facility connectée
     */
    public FacilityProfileResponse getFacilityProfile() {
        User currentUser = SecurityUtils.getCurrentUser();
        Facility facility = facilityRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Facility non trouvée"));

        return FacilityProfileResponse.builder()
                .facilityId(facility.getFacilityId())
                .email(currentUser.getEmail())
                .name(facility.getName())
                .type(facility.getType())
                .address(facility.getAddress())
                .phoneNumber(facility.getPhoneNumber())
                .build();
    }

    /**
     * Met à jour le profil de la facility connectée
     */
    @Transactional
    public FacilityProfileResponse updateFacilityProfile(FacilityProfileUpdateRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        Facility facility = facilityRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Facility non trouvée"));

        // Validation et mise à jour
        if (StringUtils.hasText(request.getName())) {
            facility.setName(request.getName());
        }
        if (StringUtils.hasText(request.getType())) {
            facility.setType(request.getType());
        }
        if (StringUtils.hasText(request.getAddress())) {
            facility.setAddress(request.getAddress());
        }
        if (StringUtils.hasText(request.getPhoneNumber())) {
            facility.setPhoneNumber(request.getPhoneNumber());
        }

        Facility updatedFacility = facilityRepository.save(facility);

        return FacilityProfileResponse.builder()
                .facilityId(updatedFacility.getFacilityId())
                .email(currentUser.getEmail())
                .name(updatedFacility.getName())
                .type(updatedFacility.getType())
                .address(updatedFacility.getAddress())
                .phoneNumber(updatedFacility.getPhoneNumber())
                .build();
    }

    // ========== CHANGEMENT DE MOT DE PASSE (COMMUN À TOUS) ==========

    /**
     * Change le mot de passe de l'utilisateur connecté
     */
    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new UnauthorizedException("Le mot de passe actuel est incorrect.");
        }

        // Validation du nouveau mot de passe
        if (!StringUtils.hasText(request.getNewPassword()) || request.getNewPassword().length() < 8) {
            throw new IllegalStateException("Le nouveau mot de passe doit contenir au moins 8 caractères.");
        }

        // Mettre à jour le mot de passe
        currentUser.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }
}