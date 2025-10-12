// src/main/java/com/medqr/backend/dto/patient/PatientSummaryResponse.java
package com.medqr.backend.dto.patient;

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
public class PatientSummaryResponse {
    private UUID patientId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
}