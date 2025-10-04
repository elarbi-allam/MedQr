package com.medqr.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "provider_patient_relation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderPatientRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID relationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private HealthcareProvider provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "relationship_type", nullable = false)
    private String relationshipType; // 'TREATING_PHYSICIAN', 'SPECIALIST', 'CONSULTANT'

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}