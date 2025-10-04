package com.medqr.backend.service;

import com.medqr.backend.dto.prescription.PrescriptionRequest;
import com.medqr.backend.enums.DocumentType;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.*;
import com.medqr.backend.repository.PrescriptionRepository;
import com.medqr.backend.security.SecurityUtils; // UTILISE SecurityUtils
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientService patientService;
    private final ProviderService providerService;
    private final DocumentService documentService; // NOUVEAU SERVICE INJECTÉ

    @Transactional
    public Prescription createPrescription(UUID patientId, PrescriptionRequest request) {
        // 1. Récupérer l'utilisateur (Provider) authentifié
        User currentUser = SecurityUtils.getCurrentUser();

        // Assurez-vous que le ProviderService a cette méthode pour trouver le Provider par son UserID
        // (Basé sur la structure de votre entité HealthcareProvider)
        HealthcareProvider provider = providerService.getProviderByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé ou non lié à l'utilisateur connecté."));

        // 2. Récupérer le patient cible
        // Assurez-vous que le PatientService a cette méthode pour trouver le patient par son ID
        Patient patient = patientService.getPatientById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient cible non trouvé."));

        // 3. Créer et enregistrer la Prescription
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setProvider(provider);
        prescription.setDetails(request.getDetails());

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // 4. Créer le Document associé (pour qu'il apparaisse dans le dossier patient)
        Document document = createPrescriptionDocument(savedPrescription, provider);
        savedPrescription.setRelatedDocument(document);

        // Re-sauvegarder la prescription pour lier le Document (nécessaire si vous utilisez OneToOne)
        prescriptionRepository.save(savedPrescription);

        return savedPrescription;
    }

    private Document createPrescriptionDocument(Prescription prescription, HealthcareProvider provider) {
        Document doc = new Document();

        // Récupérer le dossier médical du patient pour l'y attacher
        // NOTE: Ceci suppose que votre entité Patient a une relation OneToOne avec MedicalRecord,
        // ou qu'il existe une méthode pour la trouver via le PatientService/MedicalRecordService.
        MedicalRecord record = prescription.getPatient().getMedicalRecord();
        if (record == null) {
            throw new ResourceNotFoundException("Dossier médical du patient non trouvé. Impossible d'ajouter l'ordonnance.");
        }
        doc.setMedicalRecord(record);

        // Métadonnées
        doc.setType(DocumentType.PRESCRIPTION);
        doc.setTitle("Ordonnance du " + prescription.getPrescriptionDate());
        doc.setUploadDate(LocalDateTime.now());
        doc.setIsFromProvider(true);
        doc.setProviderId(provider.getProviderId());

        // Le fichier n'est pas un PDF physique; nous utilisons l'ID de la prescription comme référence de chemin
        doc.setFilePath("PRESCRIPTION_REF_" + prescription.getPrescriptionId());

        // Enregistrer le document via le service dédié
        return documentService.saveDocument(doc);
    }
}