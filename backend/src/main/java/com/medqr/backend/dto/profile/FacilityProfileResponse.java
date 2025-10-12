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
public class FacilityProfileResponse {
    private UUID facilityId;
    private String email;
    private String name;
    private String type;
    private String address;
    private String phoneNumber;
}