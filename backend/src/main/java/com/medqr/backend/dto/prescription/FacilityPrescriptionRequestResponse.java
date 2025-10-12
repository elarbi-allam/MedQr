// src/main/java/com/medqr/backend/dto/prescription/FacilityPrescriptionRequestResponse.java
package com.medqr.backend.dto.prescription;

import com.medqr.backend.enums.FacilityPrescriptionRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityPrescriptionRequestResponse {
    private UUID requestId;
    private String facilityName;
    private String prescriptionDetails;
    private FacilityPrescriptionRequestStatus status;
    private LocalDateTime requestedAt;
    private String estimatedDelay;
    private Double estimatedPrice;
}