package com.medqr.backend.dto.document;

import com.medqr.backend.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentUploadRequest {
    @NotBlank(message = "Le titre du document est requis.")
    private String title;

    @NotNull(message = "Le type de document est requis.")
    private DocumentType type;
    // Le fichier lui-même est géré via MultipartFile dans le contrôleur
}