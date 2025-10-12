// src/main/java/com/medqr/backend/service/MedicationService.java
package com.medqr.backend.service;

import com.medqr.backend.dto.medication.MedicationRequest;
import com.medqr.backend.dto.medication.MedicationResponse;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.HealthcareProvider;
import com.medqr.backend.model.MedicalRecord;
import com.medqr.backend.model.Medication;
import com.medqr.backend.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicalRecordService medicalRecordService;
    private final ProviderService providerService;
    private final ProviderPatientService providerPatientService;

    /**
     * [PROVIDER] Ajouter un médicament au dossier d'un patient
     */
    @Transactional
    public MedicationResponse addMedication(UUID patientId, MedicationRequest request) {
        HealthcareProvider provider = providerService.getCurrentProvider();
        providerPatientService.verifyAccessToPatient(patientId);

        MedicalRecord record = medicalRecordService.getRecordByPatientId(patientId);

        Medication medication = new Medication();
        medication.setMedicalRecord(record);
        medication.setPrescribedBy(provider);
        medication.setName(request.getName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(request.getFrequency());
        medication.setStartDate(request.getStartDate());
        medication.setEndDate(request.getEndDate());
        medication.setIsCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : true);

        Medication saved = medicationRepository.save(medication);

        return mapToResponse(saved);
    }

    /**
     * [PATIENT] Voir tous mes médicaments
     */
    public Page<MedicationResponse> getMyMedications(Pageable pageable, Boolean currentOnly) {
        MedicalRecord record = medicalRecordService.getRecordForCurrentUser();

        Page<Medication> medications;
        if (currentOnly != null && currentOnly) {
            medications = medicationRepository.findByMedicalRecordAndIsCurrentTrueOrderByStartDateDesc(record, pageable);
        } else {
            medications = medicationRepository.findByMedicalRecordOrderByStartDateDesc(record, pageable);
        }

        return medications.map(this::mapToResponse);
    }

    /**
     * [PROVIDER] Voir les médicaments d'un patient
     */
    public Page<MedicationResponse> getPatientMedications(UUID patientId, Pageable pageable, Boolean currentOnly) {
        providerPatientService.verifyAccessToPatient(patientId);

        MedicalRecord record = medicalRecordService.getRecordByPatientId(patientId);

        Page<Medication> medications;
        if (currentOnly != null && currentOnly) {
            medications = medicationRepository.findByMedicalRecordAndIsCurrentTrueOrderByStartDateDesc(record, pageable);
        } else {
            medications = medicationRepository.findByMedicalRecordOrderByStartDateDesc(record, pageable);
        }

        return medications.map(this::mapToResponse);
    }

    /**
     * [PROVIDER] Mettre à jour un médicament
     */
    @Transactional
    public MedicationResponse updateMedication(UUID medicationId, MedicationRequest request) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé."));

        providerPatientService.verifyAccessToPatient(medication.getMedicalRecord().getPatient().getPatientId());

        medication.setName(request.getName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(request.getFrequency());
        medication.setStartDate(request.getStartDate());
        medication.setEndDate(request.getEndDate());
        medication.setIsCurrent(request.getIsCurrent());

        Medication updated = medicationRepository.save(medication);

        return mapToResponse(updated);
    }

    private MedicationResponse mapToResponse(Medication medication) {
        String providerName = medication.getPrescribedBy() != null
                ? "Dr. " + medication.getPrescribedBy().getFirstName() + " " + medication.getPrescribedBy().getLastName()
                : null;

        return MedicationResponse.builder()
                .medicationId(medication.getMedicationId())
                .name(medication.getName())
                .dosage(medication.getDosage())
                .frequency(medication.getFrequency())
                .startDate(medication.getStartDate())
                .endDate(medication.getEndDate())
                .isCurrent(medication.getIsCurrent())
                .prescribedByName(providerName)
                .build();
    }
}