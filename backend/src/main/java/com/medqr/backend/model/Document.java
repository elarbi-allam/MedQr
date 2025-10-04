package com.medqr.backend.model;

import com.medqr.backend.enums.DocumentType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private MedicalRecord medicalRecord; // Lien vers le dossier

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    @Column(nullable = false)
    private String title;

    @Column(name = "file_path", nullable = false)
    private String filePath; // Chemin sécurisé vers le fichier sur le système

    @Column(name = "is_from_provider")
    private Boolean isFromProvider; // True si vient d'un PROVIDER/FACILITY

    // Nous laissons 'facility_Or_Provider_id' et 'provider_id' de côté pour l'instant
    // car ils sont complexes. On peut utiliser des relations ManyToOne si besoin.

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate = LocalDateTime.now();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}