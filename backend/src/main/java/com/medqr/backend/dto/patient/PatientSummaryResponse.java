package com.medqr.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
public class PatientSummaryResponse {
    private UUID patientId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
}