// src/main/java/com/medqr/backend/dto/vaccination/VaccinationRequest.java
package com.medqr.backend.dto.vaccination;

import lombok.Data;

import java.time.LocalDate;

@Data
public class VaccinationRequest {
    private String vaccineName;
    private LocalDate vaccinationDate;
}