// src/main/java/com/medqr/backend/dto/prescription/FacilityPrescriptionRequestRequest.java
package com.medqr.backend.dto.prescription;

import lombok.Data;

@Data
public class FacilityPrescriptionRequestRequest {
    private String estimatedDelay; // "2 heures", "1 jour", etc.
    private Double estimatedPrice;
}