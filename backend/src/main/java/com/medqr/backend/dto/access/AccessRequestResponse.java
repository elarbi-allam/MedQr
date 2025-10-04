package com.medqr.backend.dto.access;

import com.medqr.backend.enums.AccessRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class AccessRequestResponse {
    private UUID requestId;
    private String providerName;
    private String providerSpecialty;
    private AccessRequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime expiresAt;
}