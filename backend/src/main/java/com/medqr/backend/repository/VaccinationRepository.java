// src/main/java/com/medqr/backend/repository/VaccinationRepository.java
package com.medqr.backend.repository;

import com.medqr.backend.model.Vaccination;
import com.medqr.backend.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, UUID> {

    Page<Vaccination> findByMedicalRecordOrderByVaccinationDateDesc(MedicalRecord medicalRecord, Pageable pageable);
}