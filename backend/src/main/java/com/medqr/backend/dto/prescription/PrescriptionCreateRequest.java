package com.medqr.backend.dto.prescription;

import com.medqr.backend.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PrescriptionCreateRequest {

    @NotBlank(message = "Le titre du document est requis")
    private String documentTitle;

    @NotNull(message = "Le type de document est requis")
    private DocumentType documentType; // Généralement PRESCRIPTION

    @NotBlank(message = "Les détails de l'ordonnance sont requis")
    private String details;

    // Le fichier PDF sera dans MultipartFile
}