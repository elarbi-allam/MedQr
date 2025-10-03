package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.model.Facility;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public Facility createFacility(User user, RegisterRequest request) {

        // Validation Conditionnelle
        if (!StringUtils.hasText(request.getName())) {
            throw new IllegalStateException("Le nom de l'établissement est requis.");
        }
        if (!StringUtils.hasText(request.getType())) {
            throw new IllegalStateException("Le type de l'établissement (Hôpital, Labo, etc.) est requis.");
        }

        // Création et mapping
        Facility facility = new Facility();

        // NOTE: user_id est optionnel pour Facility selon votre schéma, nous le passons s'il existe
        facility.setUser(user);

        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setPhoneNumber(request.getPhoneNumber());
        facility.setAddress(request.getAddress());

        return facilityRepository.save(facility);
    }
}