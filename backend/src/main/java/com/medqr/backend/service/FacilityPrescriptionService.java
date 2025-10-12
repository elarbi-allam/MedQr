// src/main/java/com/medqr/backend/service/FacilityPrescriptionService.java
package com.medqr.backend.service;

import com.medqr.backend.dto.prescription.FacilityAccessCodeResponse;
import com.medqr.backend.dto.prescription.FacilityPrescriptionRequestRequest;
import com.medqr.backend.dto.prescription.FacilityPrescriptionRequestResponse;
import com.medqr.backend.dto.prescription.PrescriptionDetailResponse;
import com.medqr.backend.enums.DocumentSource;
import com.medqr.backend.enums.DocumentType;
import com.medqr.backend.enums.FacilityPrescriptionRequestStatus;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.exception.UnauthorizedException;
import com.medqr.backend.model.*;
import com.medqr.backend.repository.FacilityPrescriptionRequestRepository;
import com.medqr.backend.repository.PrescriptionRepository;
import com.medqr.backend.utils.CodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FacilityPrescriptionService {

    private final FacilityPrescriptionRequestRepository requestRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientService patientService;
    private final FacilityService facilityService;
    private final MedicalRecordService medicalRecordService;
    private final DocumentService documentService;
    private final FileStorageService fileStorageService;

    /**
     * [PATIENT] Génère un code QR pour une ordonnance (PAS de facility ID)
     */
    @Transactional
    public FacilityAccessCodeResponse generateAccessCodeForPrescription(UUID prescriptionId) {
        Patient patient = patientService.getCurrentPatient();

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Ordonnance non trouvée."));

        if (!prescription.getPatient().equals(patient)) {
            throw new UnauthorizedException("Cette ordonnance ne vous appartient pas.");
        }

        if (prescription.getIsCompleted()) {
            throw new IllegalStateException("Cette ordonnance est déjà complétée.");
        }

        // Générer ou régénérer le code
        String accessCode = CodeGenerator.generateAccessCode();
        prescription.setAccessCode(accessCode);
        prescription.setAccessCodeExpiresAt(LocalDateTime.now().plusDays(7));

        prescriptionRepository.save(prescription);

        return FacilityAccessCodeResponse.builder()
                .accessCode(accessCode)
                .expiresAt(prescription.getAccessCodeExpiresAt())
                .prescriptionDetails(prescription.getDetails())
                .build();
    }

    /**
     * [FACILITY] Scanner le code et faire une demande d'accès
     */
    @Transactional
    public String requestAccessToPrescription(String accessCode, FacilityPrescriptionRequestRequest request) {
        Facility currentFacility = facilityService.getCurrentFacility();

        Prescription prescription = prescriptionRepository.findByAccessCode(accessCode)
                .orElseThrow(() -> new ResourceNotFoundException("Code d'accès invalide."));

        if (prescription.getAccessCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Ce code d'accès a expiré.");
        }

        if (prescription.getIsCompleted()) {
            throw new IllegalStateException("Cette ordonnance est déjà complétée.");
        }

        // Vérifier si cette facility a déjà fait une demande
        requestRepository.findByPrescriptionAndFacility(prescription, currentFacility)
                .ifPresent(existingRequest -> {
                    throw new IllegalStateException("Vous avez déjà fait une demande pour cette ordonnance.");
                });

        // Créer la demande
        FacilityPrescriptionRequest newRequest = new FacilityPrescriptionRequest();
        newRequest.setPrescription(prescription);
        newRequest.setPatient(prescription.getPatient());
        newRequest.setFacility(currentFacility);
        newRequest.setStatus(FacilityPrescriptionRequestStatus.PENDING);
        newRequest.setEstimatedDelay(request.getEstimatedDelay());
        newRequest.setEstimatedPrice(request.getEstimatedPrice());

        requestRepository.save(newRequest);

        return "Demande d'accès envoyée au patient. En attente d'approbation.";
    }

    /**
     * [PATIENT] Voir toutes les demandes pour mes ordonnances
     */
    public Page<FacilityPrescriptionRequestResponse> getMyPendingRequests(Pageable pageable) {
        Patient patient = patientService.getCurrentPatient();

        Page<FacilityPrescriptionRequest> requests = requestRepository
                .findByPatientAndStatus(patient, FacilityPrescriptionRequestStatus.PENDING, pageable);

        return requests.map(this::mapToResponse);
    }

    /**
     * [PATIENT] Voir toutes les demandes pour une ordonnance spécifique
     */
    public List<FacilityPrescriptionRequestResponse> getRequestsForPrescription(UUID prescriptionId) {
        Patient patient = patientService.getCurrentPatient();

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Ordonnance non trouvée."));

        if (!prescription.getPatient().equals(patient)) {
            throw new UnauthorizedException("Cette ordonnance ne vous appartient pas.");
        }

        List<FacilityPrescriptionRequest> requests = requestRepository.findByPrescription(prescription);

        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * [PATIENT] Approuver UNE facility parmi les demandes
     */
    @Transactional
    public String approveFacilityRequest(UUID requestId) {
        Patient patient = patientService.getCurrentPatient();

        FacilityPrescriptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        if (!request.getPatient().equals(patient)) {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à approuver cette demande.");
        }

        if (request.getStatus() != FacilityPrescriptionRequestStatus.PENDING) {
            throw new IllegalStateException("Cette demande n'est plus en attente.");
        }

        // Approuver cette demande
        request.setStatus(FacilityPrescriptionRequestStatus.APPROVED);
        request.setRespondedAt(LocalDateTime.now());
        requestRepository.save(request);

        // Rejeter automatiquement toutes les autres demandes pour cette ordonnance
        List<FacilityPrescriptionRequest> otherRequests = requestRepository.findByPrescription(request.getPrescription());
        for (FacilityPrescriptionRequest otherRequest : otherRequests) {
            if (!otherRequest.getRequestId().equals(requestId) &&
                    otherRequest.getStatus() == FacilityPrescriptionRequestStatus.PENDING) {
                otherRequest.setStatus(FacilityPrescriptionRequestStatus.REJECTED);
                otherRequest.setRespondedAt(LocalDateTime.now());
                requestRepository.save(otherRequest);
            }
        }

        return "Accès approuvé pour " + request.getFacility().getName() + ". Les autres demandes ont été rejetées automatiquement.";
    }

    /**
     * [PATIENT] Rejeter une demande
     */
    @Transactional
    public String rejectFacilityRequest(UUID requestId) {
        Patient patient = patientService.getCurrentPatient();

        FacilityPrescriptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        if (!request.getPatient().equals(patient)) {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à rejeter cette demande.");
        }

        request.setStatus(FacilityPrescriptionRequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());
        requestRepository.save(request);

        return "Demande rejetée.";
    }


    /**
     * [FACILITY] Voir l'ordonnance après approbation
     */
    public PrescriptionDetailResponse viewPrescription(UUID requestId) {
        Facility currentFacility = facilityService.getCurrentFacility();

        FacilityPrescriptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        if (!request.getFacility().equals(currentFacility)) {
            throw new UnauthorizedException("Cette demande ne concerne pas votre établissement.");
        }

        if (request.getStatus() != FacilityPrescriptionRequestStatus.APPROVED &&
                request.getStatus() != FacilityPrescriptionRequestStatus.COMPLETED) {
            throw new UnauthorizedException("Vous n'avez pas encore été autorisé à consulter cette ordonnance.");
        }

        Prescription prescription = request.getPrescription();
        Patient patient = prescription.getPatient();
        HealthcareProvider provider = prescription.getProvider();
        Document relatedDoc = prescription.getRelatedDocument();

        return PrescriptionDetailResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .details(prescription.getDetails())
                .prescriptionDate(prescription.getPrescriptionDate())
                .isCompleted(prescription.getIsCompleted())
                .completedAt(prescription.getCompletedAt())
                // Patient info
                .patientId(patient.getPatientId())
                .patientFirstName(patient.getFirstName())
                .patientLastName(patient.getLastName())
                .patientDateOfBirth(patient.getDateOfBirth())
                // Provider info
                .providerId(provider.getProviderId())
                .providerFirstName(provider.getFirstName())
                .providerLastName(provider.getLastName())
                .providerSpecialty(provider.getSpecialty())
                // Document info
                .relatedDocumentId(relatedDoc.getDocumentId())
                .documentTitle(relatedDoc.getTitle())
                .documentType(relatedDoc.getType())
                .documentUploadDate(relatedDoc.getUploadDate())
                .build();
    }

    // src/main/java/com/medqr/backend/service/FacilityPrescriptionService.java
// Ajouter cette méthode

    /**
     * [FACILITY] Télécharger le PDF de l'ordonnance
     */
    public Resource viewPrescriptionDocument(UUID requestId) {
        Facility currentFacility = facilityService.getCurrentFacility();

        FacilityPrescriptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        if (!request.getFacility().equals(currentFacility)) {
            throw new UnauthorizedException("Cette demande ne concerne pas votre établissement.");
        }

        if (request.getStatus() != FacilityPrescriptionRequestStatus.APPROVED &&
                request.getStatus() != FacilityPrescriptionRequestStatus.COMPLETED) {
            throw new UnauthorizedException("Vous n'avez pas encore été autorisé à consulter cette ordonnance.");
        }

        Prescription prescription = request.getPrescription();
        Document relatedDocument = prescription.getRelatedDocument();

        if (relatedDocument == null) {
            throw new ResourceNotFoundException("Aucun document associé à cette ordonnance.");
        }

        return fileStorageService.loadFileAsResource(relatedDocument.getFilePath());
    }
    /**
     * [FACILITY] Ajouter le résultat
     */
    @Transactional
    public String uploadPrescriptionResult(UUID requestId, String documentTitle, MultipartFile file) {
        Facility currentFacility = facilityService.getCurrentFacility();

        FacilityPrescriptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        if (!request.getFacility().equals(currentFacility)) {
            throw new UnauthorizedException("Cette demande ne concerne pas votre établissement.");
        }

        if (request.getStatus() != FacilityPrescriptionRequestStatus.APPROVED) {
            throw new UnauthorizedException("Vous devez être approuvé avant d'ajouter un résultat.");
        }

        Patient patient = request.getPatient();
        MedicalRecord record = medicalRecordService.getRecordByPatientId(patient.getPatientId());

        String filePath = fileStorageService.storeFile(file, patient.getPatientId());

        Document document = new Document();
        document.setMedicalRecord(record);
        document.setTitle(documentTitle);
        document.setType(DocumentType.ANALYSIS);
        document.setFilePath(filePath);
        document.setUploader(DocumentSource.FACILITY, currentFacility.getFacilityId());

        Document savedDocument = documentService.saveDocument(document);

        request.setResultDocument(savedDocument);
        request.setStatus(FacilityPrescriptionRequestStatus.COMPLETED);
        requestRepository.save(request);

        Prescription prescription = request.getPrescription();
        prescription.setIsCompleted(true);
        prescription.setCompletedAt(LocalDateTime.now());
        prescriptionRepository.save(prescription);

        return "Résultat ajouté avec succès.";
    }

    /**
     * [FACILITY] Voir mes demandes approuvées
     */
    public Page<FacilityPrescriptionRequestResponse> getMyApprovedRequests(Pageable pageable) {
        Facility currentFacility = facilityService.getCurrentFacility();

        Page<FacilityPrescriptionRequest> requests = requestRepository
                .findByFacilityAndStatus(currentFacility, FacilityPrescriptionRequestStatus.APPROVED, pageable);

        return requests.map(this::mapToResponse);
    }

    private FacilityPrescriptionRequestResponse mapToResponse(FacilityPrescriptionRequest r) {
        return FacilityPrescriptionRequestResponse.builder()
                .requestId(r.getRequestId())
                .facilityName(r.getFacility().getName())
                .prescriptionDetails(r.getPrescription().getDetails())
                .status(r.getStatus())
                .requestedAt(r.getRequestedAt())
                .estimatedDelay(r.getEstimatedDelay())
                .estimatedPrice(r.getEstimatedPrice())
                .build();
    }
}