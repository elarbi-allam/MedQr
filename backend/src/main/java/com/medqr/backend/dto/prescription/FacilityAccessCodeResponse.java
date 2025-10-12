// src/main/java/com/medqr/backend/dto/prescription/FacilityAccessCodeResponse.java
package com.medqr.backend.dto.prescription;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FacilityAccessCodeResponse {
    private String accessCode;
    private LocalDateTime expiresAt;
    private String prescriptionDetails;
}