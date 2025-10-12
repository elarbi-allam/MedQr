// src/main/java/com/medqr/backend/model/Vaccination.java
package com.medqr.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vaccination")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID vaccinationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private MedicalRecord medicalRecord;

    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @Column(name = "vaccination_date", nullable = false)
    private LocalDate vaccinationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administering_facility_id")
    private Facility administeringFacility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_provider_id")
    private HealthcareProvider administeredBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}