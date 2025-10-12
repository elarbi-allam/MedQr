// src/main/java/com/medqr/backend/dto/medication/MedicationResponse.java
package com.medqr.backend.dto.medication;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class MedicationResponse {
    private UUID medicationId;
    private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
    private String prescribedByName;
}