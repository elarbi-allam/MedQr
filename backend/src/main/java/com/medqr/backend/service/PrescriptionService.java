package com.medqr.backend.service;

import com.medqr.backend.dto.prescription.PrescriptionCreateRequest;
import com.medqr.backend.enums.DocumentSource;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.*;
import com.medqr.backend.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
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

    /**
     * Crée une ordonnance avec son document PDF associé.
     */
    @Transactional
    public Prescription createPrescription(UUID patientId, PrescriptionCreateRequest request, MultipartFile file) {
        HealthcareProvider provider = providerService.getCurrentProvider();
        providerPatientService.verifyAccessToPatient(patientId);

        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        MedicalRecord record = medicalRecordService.getRecordByPatientId(patientId);

        // 1. Stocker le fichier PDF
        String filePath = fileStorageService.storeFile(file, patientId);

        // 2. Créer le document
        Document document = new Document();
        document.setMedicalRecord(record);
        document.setType(request.getDocumentType());
        document.setTitle(request.getDocumentTitle());
        document.setFilePath(filePath);
        document.setUploader(DocumentSource.PROVIDER, provider.getProviderId());

        Document savedDocument = documentService.saveDocument(document);

        // 3. Créer la prescription
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setProvider(provider);
        prescription.setDetails(request.getDetails());
        prescription.setRelatedDocument(savedDocument);
        prescription.setIsCompleted(false);

        return prescriptionRepository.save(prescription);
    }

    /**
     * Marque une ordonnance comme réalisée.
     */
    @Transactional
    public Prescription markPrescriptionAsCompleted(UUID prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Ordonnance non trouvée."));

        prescription.setIsCompleted(true);
        prescription.setCompletedAt(LocalDateTime.now());

        return prescriptionRepository.save(prescription);
    }

    /**
     * Récupère toutes les ordonnances d'un patient.
     */
    public List<Prescription> getPrescriptionsForPatient(UUID patientId) {
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé."));

        return prescriptionRepository.findByPatientOrderByPrescriptionDateDesc(patient);
    }
}