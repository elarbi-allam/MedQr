package com.medqr.backend.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderProfileResponse {
    private UUID providerId;
    private String email;
    private String firstName;
    private String lastName;
    private String specialty;
    private String phoneNumber;
    private String licenseNumber;
}