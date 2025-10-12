// src/main/java/com/medqr/backend/dto/medication/MedicationRequest.java
package com.medqr.backend.dto.medication;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicationRequest {
    private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
}