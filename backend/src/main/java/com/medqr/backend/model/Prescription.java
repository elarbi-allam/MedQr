package com.medqr.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID prescriptionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private HealthcareProvider provider;

    @Column(name = "prescription_date", nullable = false)
    private LocalDate prescriptionDate = LocalDate.now();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String details;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_document_id", nullable = false)
    private Document relatedDocument;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // src/main/java/com/medqr/backend/model/Prescription.java (AJOUT)
    @Column(name = "access_code", unique = true)
    private String accessCode;

    @Column(name = "access_code_expires_at")
    private LocalDateTime accessCodeExpiresAt;
}