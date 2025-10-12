// src/main/java/com/medqr/backend/dto/prescription/PrescriptionResponse.java
package com.medqr.backend.dto.prescription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    private UUID prescriptionId;
    private UUID patientId;
    private UUID providerId;
    private String details;
    private LocalDate prescriptionDate;
    private UUID relatedDocumentId;
    private Boolean isCompleted;
}