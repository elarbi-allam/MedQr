// src/main/java/com/medqr/backend/service/PrescriptionService.java (MISE À JOUR)
package com.medqr.backend.service;

import com.medqr.backend.dto.prescription.PrescriptionCreateRequest;
import com.medqr.backend.enums.DocumentSource;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.*;
import com.medqr.backend.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final ProviderService providerService;
    private final PatientService patientService;
    private final DocumentService documentService;
    private final MedicalRecordService medicalRecordService;
    private final ProviderPatientService providerPatientService;
    private final FileStorageService fileStorageService;

    @Transactional
    public Prescription createPrescription(UUID patientId, PrescriptionCreateRequest request, MultipartFile file) {
        HealthcareProvider provider = providerService.getCurrentProvider();
        providerPatientService.verifyAccessToPatient(patientId);

        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        MedicalRecord record = medicalRecordService.getRecordByPatientId(patientId);

        String filePath = fileStorageService.storeFile(file, patientId);

        Document document = new Document();
        document.setMedicalRecord(record);
        document.setType(request.getDocumentType());
        document.setTitle(request.getDocumentTitle());
        document.setFilePath(filePath);
        document.setUploader(DocumentSource.PROVIDER, provider.getProviderId());

        Document savedDocument = documentService.saveDocument(document);

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setProvider(provider);
        prescription.setDetails(request.getDetails());
        prescription.setRelatedDocument(savedDocument);
        prescription.setIsCompleted(false);

        return prescriptionRepository.save(prescription);
    }

    @Transactional
    public Prescription markPrescriptionAsCompleted(UUID prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Ordonnance non trouvée."));

        prescription.setIsCompleted(true);
        prescription.setCompletedAt(LocalDateTime.now());

        return prescriptionRepository.save(prescription);
    }

    // NOUVELLE: Pagination
    public Page<Prescription> getPrescriptionsForPatient(UUID patientId, Pageable pageable) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        return prescriptionRepository.findByPatientOrderByPrescriptionDateDesc(patient, pageable);
    }

    // NOUVELLE: Pagination avec filtre
    public Page<Prescription> getPrescriptionsForPatient(UUID patientId, Boolean isCompleted, Pageable pageable) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        if (isCompleted != null) {
            return prescriptionRepository.findByPatientAndIsCompletedOrderByPrescriptionDateDesc(patient, isCompleted, pageable);
        }

        return prescriptionRepository.findByPatientOrderByPrescriptionDateDesc(patient, pageable);
    }

    // NOUVELLE: Pour le patient actuel
    public Page<Prescription> getMyPrescriptions(Boolean isCompleted, Pageable pageable) {
        Patient patient = patientService.getCurrentPatient();

        if (isCompleted != null) {
            return prescriptionRepository.findByPatientAndIsCompletedOrderByPrescriptionDateDesc(patient, isCompleted, pageable);
        }

        return prescriptionRepository.findByPatientOrderByPrescriptionDateDesc(patient, pageable);
    }
}