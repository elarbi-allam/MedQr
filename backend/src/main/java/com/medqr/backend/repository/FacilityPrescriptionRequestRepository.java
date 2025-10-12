// src/main/java/com/medqr/backend/repository/FacilityPrescriptionRequestRepository.java
package com.medqr.backend.repository;

import com.medqr.backend.enums.FacilityPrescriptionRequestStatus;
import com.medqr.backend.model.FacilityPrescriptionRequest;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.Prescription;
import com.medqr.backend.model.Facility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FacilityPrescriptionRequestRepository extends JpaRepository<FacilityPrescriptionRequest, UUID> {

    // Plusieurs demandes possibles pour une même prescription
    List<FacilityPrescriptionRequest> findByPrescription(Prescription prescription);

    // Vérifier si une facility a déjà fait une demande pour cette prescription
    Optional<FacilityPrescriptionRequest> findByPrescriptionAndFacility(Prescription prescription, Facility facility);

    Page<FacilityPrescriptionRequest> findByPatientAndStatus(Patient patient, FacilityPrescriptionRequestStatus status, Pageable pageable);

    Page<FacilityPrescriptionRequest> findByFacilityAndStatus(Facility facility, FacilityPrescriptionRequestStatus status, Pageable pageable);
}