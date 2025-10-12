package com.medqr.backend.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String specialty;
    private String phoneNumber;
    private String licenseNumber;
}