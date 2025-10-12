// src/main/java/com/medqr/backend/repository/FacilityRepository.java
package com.medqr.backend.repository;

import com.medqr.backend.model.Facility;
import com.medqr.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, UUID> {
    Page<Facility> findByTypeContainingIgnoreCase(String type, Pageable pageable);
    Optional<Facility> findByUser(User user);
}