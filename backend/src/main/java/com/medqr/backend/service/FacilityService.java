// src/main/java/com/medqr/backend/service/FacilityService.java
package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.model.Facility;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.FacilityRepository;
import com.medqr.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public Facility createFacility(User user, RegisterRequest request) {
        if (!StringUtils.hasText(request.getName())) {
            throw new IllegalStateException("Le nom de l'établissement est requis.");
        }
        if (!StringUtils.hasText(request.getType())) {
            throw new IllegalStateException("Le type de l'établissement (Hôpital, Labo, etc.) est requis.");
        }

        Facility facility = new Facility();
        facility.setUser(user);
        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setPhoneNumber(request.getPhoneNumber());
        facility.setAddress(request.getAddress());

        return facilityRepository.save(facility);
    }

    /**
     * Récupère toutes les facilities avec filtre optionnel par type
     */
    public Page<Facility> getAllFacilities(String type, Pageable pageable) {
        if (StringUtils.hasText(type)) {
            return facilityRepository.findByTypeContainingIgnoreCase(type, pageable);
        }
        return facilityRepository.findAll(pageable);
    }

    /**
     * Récupère la facility actuellement connectée
     */
    public Facility getCurrentFacility() {
        User currentUser = SecurityUtils.getCurrentUser();
        return facilityRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Facility non trouvée pour l'utilisateur connecté."));
    }

    public Optional<Facility> findByUser(User user) {
        return facilityRepository.findByUser(user);
    }
}