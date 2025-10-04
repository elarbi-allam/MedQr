package com.medqr.backend.model;

import com.medqr.backend.enums.DocumentSource;
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
    private MedicalRecord medicalRecord;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    @Column(nullable = false)
    private String title;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private DocumentSource source;

    @Column(name = "uploaded_by_patient_id")
    private UUID uploadedByPatientId;

    @Column(name = "uploaded_by_provider_id")
    private UUID uploadedByProviderId;

    @Column(name = "uploaded_by_facility_id")
    private UUID uploadedByFacilityId;

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate = LocalDateTime.now();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UUID getUploaderId() {
        switch (source) {
            case PATIENT: return uploadedByPatientId;
            case PROVIDER: return uploadedByProviderId;
            case FACILITY: return uploadedByFacilityId;
            default: return null;
        }
    }

    public void setUploader(DocumentSource source, UUID uploaderId) {
        this.source = source;
        switch (source) {
            case PATIENT:
                this.uploadedByPatientId = uploaderId;
                break;
            case PROVIDER:
                this.uploadedByProviderId = uploaderId;
                break;
            case FACILITY:
                this.uploadedByFacilityId = uploaderId;
                break;
        }
    }
}