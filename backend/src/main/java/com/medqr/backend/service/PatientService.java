package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public Patient createPatient(User user, RegisterRequest request) {

        // Validation Conditionnelle
        if (!StringUtils.hasText(request.getFirstName()) || !StringUtils.hasText(request.getLastName())) {
            throw new IllegalStateException("Le prénom et nom du patient sont requis.");
        }

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAddress(request.getAddress());

        return patientRepository.save(patient);
    }
}