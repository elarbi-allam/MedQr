package com.medqr.backend.enums;

public enum FacilityPrescriptionRequestStatus {
    PENDING,    // En attente de réponse du patient
    APPROVED,   // Approuvé par le patient
    REJECTED,   // Rejeté par le patient
    EXPIRED,    // Code expiré
    COMPLETED   // Résultat ajouté par la facility
}