package com.medqr.backend.repository;

import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ProviderRepository extends JpaRepository<HealthcareProvider, UUID> {

    Optional<HealthcareProvider> findByUser(User user);

    Optional<HealthcareProvider> findByLicenseNumber(String licenseNumber);
}