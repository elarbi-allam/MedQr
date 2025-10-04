package com.medqr.backend.service;

import com.medqr.backend.dto.access.AccessCodeResponse;
import com.medqr.backend.dto.access.AccessRequestResponse;
import com.medqr.backend.enums.AccessRequestStatus;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.exception.UnauthorizedException;
import com.medqr.backend.model.*;
import com.medqr.backend.repository.ProviderPatientAccessRequestRepository;
import com.medqr.backend.repository.ProviderPatientRelationRepository;
import com.medqr.backend.utils.CodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccessManagementService {

    private final ProviderPatientAccessRequestRepository accessRequestRepository;
    private final ProviderPatientRelationRepository relationRepository;
    private final PatientService patientService;
    private final ProviderService providerService;

    /**
     * Génère un code d'accès pour que le patient puisse partager avec un provider.
     */
    @Transactional
    public AccessCodeResponse generateAccessCode() {
        Patient patient = patientService.getCurrentPatient();

        // Générer un code unique
        String accessCode = CodeGenerator.generateAccessCode();

        // Créer une "demande fantôme" qui sera complétée quand le provider scanne
        ProviderPatientAccessRequest request = new ProviderPatientAccessRequest();
        request.setPatient(patient);
        request.setAccessCode(accessCode);
        request.setStatus(AccessRequestStatus.PENDING);
        request.setExpiresAt(LocalDateTime.now().plusHours(24)); // Expire après 24h

        accessRequestRepository.save(request);

        return AccessCodeResponse.builder()
                .accessCode(accessCode)
                .expiresAt(request.getExpiresAt())
                .build();
    }

    /**
     * Le provider scanne le code QR et fait une demande d'accès.
     */
    @Transactional
    public String requestAccessWithCode(String accessCode) {
        HealthcareProvider provider = providerService.getCurrentProvider();

        ProviderPatientAccessRequest request = accessRequestRepository.findByAccessCode(accessCode)
                .orElseThrow(() -> new ResourceNotFoundException("Code d'accès invalide ou expiré."));

        // Vérifier l'expiration
        if (request.getExpiresAt().isBefore(LocalDateTime.now())) {
            request.setStatus(AccessRequestStatus.EXPIRED);
            accessRequestRepository.save(request);
            throw new UnauthorizedException("Ce code d'accès a expiré.");
        }

        // Vérifier si déjà utilisé par un autre provider
        if (request.getProvider() != null && !request.getProvider().equals(provider)) {
            throw new UnauthorizedException("Ce code a déjà été utilisé par un autre professionnel.");
        }

        // Attacher le provider à la demande
        request.setProvider(provider);
        accessRequestRepository.save(request);

        return "Demande d'accès envoyée au patient. En attente d'approbation.";
    }

    /**
     * Liste les demandes d'accès en attente pour le patient connecté.
     */
    public List<AccessRequestResponse> getPendingAccessRequests() {
        Patient patient = patientService.getCurrentPatient();

        List<ProviderPatientAccessRequest> requests = accessRequestRepository
                .findByPatientAndStatus(patient, AccessRequestStatus.PENDING);

        return requests.stream()
                .filter(r -> r.getProvider() != null) // Seulement les demandes avec un provider
                .map(r -> AccessRequestResponse.builder()
                        .requestId(r.getRequestId())
                        .providerName("Dr. " + r.getProvider().getFirstName() + " " + r.getProvider().getLastName())
                        .providerSpecialty(r.getProvider().getSpecialty())
                        .status(r.getStatus())
                        .requestedAt(r.getRequestedAt())
                        .expiresAt(r.getExpiresAt())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Le patient approuve une demande d'accès.
     */
    @Transactional
    public String approveAccessRequest(UUID requestId) {
        Patient patient = patientService.getCurrentPatient();

        ProviderPatientAccessRequest request = accessRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        // Vérifier que c'est bien le patient concerné
        if (!request.getPatient().equals(patient)) {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à approuver cette demande.");
        }

        if (request.getStatus() != AccessRequestStatus.PENDING) {
            throw new IllegalStateException("Cette demande n'est plus en attente.");
        }

        // Approuver
        request.setStatus(AccessRequestStatus.APPROVED);
        request.setRespondedAt(LocalDateTime.now());
        accessRequestRepository.save(request);

        // Créer la relation permanente
        ProviderPatientRelation relation = new ProviderPatientRelation();
        relation.setProvider(request.getProvider());
        relation.setPatient(patient);
        relation.setRelationshipType("TREATING_PHYSICIAN");
        relation.setIsActive(true);
        relationRepository.save(relation);

        return "Accès approuvé. Le professionnel peut maintenant consulter votre dossier.";
    }

    /**
     * Le patient rejette une demande d'accès.
     */
    @Transactional
    public String rejectAccessRequest(UUID requestId) {
        Patient patient = patientService.getCurrentPatient();

        ProviderPatientAccessRequest request = accessRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée."));

        if (!request.getPatient().equals(patient)) {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à rejeter cette demande.");
        }

        request.setStatus(AccessRequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());
        accessRequestRepository.save(request);

        return "Demande d'accès rejetée.";
    }
}