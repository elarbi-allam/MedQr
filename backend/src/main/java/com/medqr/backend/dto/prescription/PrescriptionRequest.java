package com.medqr.backend.dto.prescription;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionRequest {

    @NotBlank(message = "Les détails de l'ordonnance sont obligatoires.")
    private String details;

    // Ajoutez ici des champs supplémentaires comme la date de fin, le dosage, etc. si nécessaire pour votre entité Prescription.
    // private LocalDate endDate;
    // private String dosage;
}