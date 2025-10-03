package com.medqr.backend.repository;

import com.medqr.backend.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FacilityRepository extends JpaRepository<Facility, UUID> {
    // Aucune méthode personnalisée nécessaire pour l'instant
}