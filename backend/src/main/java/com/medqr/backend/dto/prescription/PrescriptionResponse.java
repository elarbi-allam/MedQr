package com.medqr.backend.dto.prescription;

import java.time.LocalDate;
import java.util.UUID;
import lombok.Value;

@Value
public class PrescriptionResponse {
    UUID prescriptionId;
    UUID patientId;
    UUID providerId;
    String details;
    LocalDate prescriptionDate;
    UUID relatedDocumentId; // Pour indiquer le document créé dans le dossier du patient
}