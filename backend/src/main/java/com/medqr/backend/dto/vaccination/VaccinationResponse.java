// src/main/java/com/medqr/backend/dto/vaccination/VaccinationResponse.java
package com.medqr.backend.dto.vaccination;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class VaccinationResponse {
    private UUID vaccinationId;
    private String vaccineName;
    private LocalDate vaccinationDate;
    private String administeredByName;
    private String facilityName;
}