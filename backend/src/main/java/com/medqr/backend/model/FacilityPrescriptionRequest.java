// src/main/java/com/medqr/backend/model/FacilityPrescriptionRequest.java
package com.medqr.backend.model;

import com.medqr.backend.enums.FacilityPrescriptionRequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "facility_prescription_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacilityPrescriptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID requestId;

    // IMPORTANT: Pas unique, plusieurs facilities peuvent demander
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityPrescriptionRequestStatus status = FacilityPrescriptionRequestStatus.PENDING;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_document_id")
    private Document resultDocument;

    // Informations supplémentaires que la facility peut ajouter lors de la demande
    @Column(name = "estimated_delay")
    private String estimatedDelay; // "2 heures", "24 heures", etc.

    @Column(name = "estimated_price")
    private Double estimatedPrice;
}