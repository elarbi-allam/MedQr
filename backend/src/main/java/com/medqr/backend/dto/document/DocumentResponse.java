package com.medqr.backend.dto.document;

import com.medqr.backend.enums.DocumentType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DocumentResponse {
    private UUID documentId;
    private String title;
    private DocumentType type;
    private LocalDateTime uploadDate;
    private Boolean isFromProvider;
}