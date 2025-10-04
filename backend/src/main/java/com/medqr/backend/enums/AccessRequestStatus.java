package com.medqr.backend.enums;

/**
 * Statut d'une demande d'accès d'un provider au dossier médical d'un patient.
 */
public enum AccessRequestStatus {

    /**
     * La demande est en attente de validation par le patient.
     */
    PENDING,

    /**
     * Le patient a approuvé la demande d'accès.
     */
    APPROVED,

    /**
     * Le patient a rejeté la demande d'accès.
     */
    REJECTED,

    /**
     * Le code d'accès a expiré avant validation.
     */
    EXPIRED
}