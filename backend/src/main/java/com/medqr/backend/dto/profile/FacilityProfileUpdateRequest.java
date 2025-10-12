package com.medqr.backend.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacilityProfileUpdateRequest {
    private String name;
    private String type;
    private String address;
    private String phoneNumber;
}