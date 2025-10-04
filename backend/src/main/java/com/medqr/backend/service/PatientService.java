package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.exception.ResourceNotFoundException;
import com.medqr.backend.model.MedicalRecord;
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.MedicalRecordRepository;
import com.medqr.backend.repository.PatientRepository;
import com.medqr.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Transactional
    public Patient createPatient(User user, RegisterRequest request) {
        // Validation
        if (!StringUtils.hasText(request.getFirstName()) || !StringUtils.hasText(request.getLastName())) {
            throw new IllegalStateException("Le prénom et nom du patient sont requis.");
        }

        // Création du Patient
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAddress(request.getAddress());

        Patient savedPatient = patientRepository.save(patient);

        // Création automatique du MedicalRecord
        MedicalRecord record = new MedicalRecord();
        record.setPatient(savedPatient);
        medicalRecordRepository.save(record);

        return savedPatient;
    }

    /**
     * Récupère un patient par son ID.
     */
    public Optional<Patient> getPatientById(UUID patientId) {
        return patientRepository.findById(patientId);
    }

    /**
     * Récupère un patient par son User.
     */
    public Optional<Patient> getPatientByUser(User user) {
        return patientRepository.findByUser(user);
    }

    /**
     * Récupère le patient actuellement connecté.
     */
    public Patient getCurrentPatient() {
        User currentUser = SecurityUtils.getCurrentUser();
        return patientRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé pour l'utilisateur connecté."));
    }
}