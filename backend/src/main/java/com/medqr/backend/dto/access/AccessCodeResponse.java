package com.medqr.backend.dto.access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AccessCodeResponse {
    private String accessCode;
    private LocalDateTime expiresAt;
    private String qrCodeImage; // Base64 encoded QR code (optionnel)
}