package com.medqr.backend.repository;

import com.medqr.backend.enums.AccessRequestStatus;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.ProviderPatientAccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProviderPatientAccessRequestRepository extends JpaRepository<ProviderPatientAccessRequest, UUID> {

    Optional<ProviderPatientAccessRequest> findByAccessCode(String accessCode);

    List<ProviderPatientAccessRequest> findByPatientAndStatus(Patient patient, AccessRequestStatus status);

    List<ProviderPatientAccessRequest> findByPatientOrderByRequestedAtDesc(Patient patient);
}