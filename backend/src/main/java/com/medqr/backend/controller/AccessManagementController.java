package com.medqr.backend.controller;

import com.medqr.backend.dto.access.AccessCodeResponse;
import com.medqr.backend.dto.access.AccessRequestResponse;
import com.medqr.backend.service.AccessManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/access")
@RequiredArgsConstructor
public class AccessManagementController {

    private final AccessManagementService accessService;

    /**
     * [PATIENT] Génère un code QR pour partager avec un provider.
     */
    @PostMapping("/generate-code")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AccessCodeResponse> generateAccessCode() {
        AccessCodeResponse response = accessService.generateAccessCode();
        return ResponseEntity.ok(response);
    }

    /**
     * [PROVIDER] Scanne le QR code et fait une demande d'accès.
     */
    @PostMapping("/request-access")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<String> requestAccess(@RequestParam String code) {
        String message = accessService.requestAccessWithCode(code);
        return ResponseEntity.ok(message);
    }

    /**
     * [PATIENT] Liste les demandes d'accès en attente.
     */
    @GetMapping("/pending-requests")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AccessRequestResponse>> getPendingRequests() {
        List<AccessRequestResponse> requests = accessService.getPendingAccessRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * [PATIENT] Approuve une demande d'accès.
     */
    @PutMapping("/approve/{requestId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> approveRequest(@PathVariable UUID requestId) {
        String message = accessService.approveAccessRequest(requestId);
        return ResponseEntity.ok(message);
    }

    /**
     * [PATIENT] Rejette une demande d'accès.
     */
    @PutMapping("/reject/{requestId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> rejectRequest(@PathVariable UUID requestId) {
        String message = accessService.rejectAccessRequest(requestId);
        return ResponseEntity.ok(message);
    }
}