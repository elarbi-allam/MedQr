package com.medqr.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "facility")
@NoArgsConstructor
@AllArgsConstructor
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID facilityId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true) // user_id est unique mais pas NOT NULL selon le schéma
    private User user; // Lien optionnel avec l'entité User

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // Ex: Hospital, Lab, etc.

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phoneNumber;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    private LocalDateTime updatedAt = LocalDateTime.now();
}