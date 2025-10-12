// src/main/java/com/medqr/backend/service/VaccinationService.java
package com.medqr.backend.service;

import com.medqr.backend.dto.vaccination.VaccinationRequest;
import com.medqr.backend.dto.vaccination.VaccinationResponse;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.MedicalRecord;
import com.medqr.backend.model.Vaccination;
import com.medqr.backend.repository.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final MedicalRecordService medicalRecordService;
    private final ProviderService providerService;
    private final ProviderPatientService providerPatientService;

    /**
     * [PROVIDER] Ajouter une vaccination au dossier d'un patient
     */
    @Transactional
    public VaccinationResponse addVaccination(UUID patientId, VaccinationRequest request) {
        HealthcareProvider provider = providerService.getCurrentProvider();
        providerPatientService.verifyAccessToPatient(patientId);

        MedicalRecord record = medicalRecordService.getRecordByPatientId(patientId);

        Vaccination vaccination = new Vaccination();
        vaccination.setMedicalRecord(record);
        vaccination.setAdministeredBy(provider);
        vaccination.setVaccineName(request.getVaccineName());
        vaccination.setVaccinationDate(request.getVaccinationDate());

        Vaccination saved = vaccinationRepository.save(vaccination);

        return mapToResponse(saved);
    }

    /**
     * [PATIENT] Voir toutes mes vaccinations
     */
    public Page<VaccinationResponse> getMyVaccinations(Pageable pageable) {
        MedicalRecord record = medicalRecordService.getRecordForCurrentUser();

        Page<Vaccination> vaccinations = vaccinationRepository
                .findByMedicalRecordOrderByVaccinationDateDesc(record, pageable);

        return vaccinations.map(this::mapToResponse);
    }

    /**
     * [PROVIDER] Voir les vaccinations d'un patient
     */
    public Page<VaccinationResponse> getPatientVaccinations(UUID patientId, Pageable pageable) {
        providerPatientService.verifyAccessToPatient(patientId);

        MedicalRecord record = medicalRecordService.getRecordByPatientId(patientId);

        Page<Vaccination> vaccinations = vaccinationRepository
                .findByMedicalRecordOrderByVaccinationDateDesc(record, pageable);

        return vaccinations.map(this::mapToResponse);
    }

    private VaccinationResponse mapToResponse(Vaccination vaccination) {
        String providerName = vaccination.getAdministeredBy() != null
                ? "Dr. " + vaccination.getAdministeredBy().getFirstName() + " " + vaccination.getAdministeredBy().getLastName()
                : null;

        String facilityName = vaccination.getAdministeringFacility() != null
                ? vaccination.getAdministeringFacility().getName()
                : null;

        return VaccinationResponse.builder()
                .vaccinationId(vaccination.getVaccinationId())
                .vaccineName(vaccination.getVaccineName())
                .vaccinationDate(vaccination.getVaccinationDate())
                .administeredByName(providerName)
                .facilityName(facilityName)
                .build();
    }
}