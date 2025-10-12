// src/main/java/com/medqr/backend/dto/prescription/PrescriptionDetailResponse.java
package com.medqr.backend.dto.prescription;

import com.medqr.backend.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailResponse {
    private UUID prescriptionId;
    private String details;
    private LocalDate prescriptionDate;
    private Boolean isCompleted;
    private LocalDateTime completedAt;

    // Infos du patient
    private UUID patientId;
    private String patientFirstName;
    private String patientLastName;
    private LocalDate patientDateOfBirth;

    // Infos du provider
    private UUID providerId;
    private String providerFirstName;
    private String providerLastName;
    private String providerSpecialty;

    // Document lié
    private UUID relatedDocumentId;
    private String documentTitle;
    private DocumentType documentType;
    private LocalDateTime documentUploadDate;
}