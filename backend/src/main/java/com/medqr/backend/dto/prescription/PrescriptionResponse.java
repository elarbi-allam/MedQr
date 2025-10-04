package com.medqr.backend.dto.prescription;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
public class PrescriptionResponse {
    private UUID prescriptionId;
    private UUID patientId;
    private UUID providerId;
    private String details;
    private LocalDate prescriptionDate;
    private UUID relatedDocumentId;
}