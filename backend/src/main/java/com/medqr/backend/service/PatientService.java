package com.medqr.backend.service;

import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.model.MedicalRecord; // 1. Importer MedicalRecord
import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.MedicalRecordRepository; // 2. Importer le Repository
import com.medqr.backend.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 3. Requis pour des opérations groupées
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository; // 4. Injection du Repository

    @Transactional // S'assurer que les deux écritures DB (Patient et MedicalRecord) sont atomiques
    public Patient createPatient(User user, RegisterRequest request) {

        // Validation Conditionnelle
        if (!StringUtils.hasText(request.getFirstName()) || !StringUtils.hasText(request.getLastName())) {
            throw new IllegalStateException("Le prénom et nom du patient sont requis.");
        }

        // 1. Création et sauvegarde du Patient
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAddress(request.getAddress());

        Patient savedPatient = patientRepository.save(patient); // Sauvegarde pour obtenir le patient_id

        // 2. Création et sauvegarde du MedicalRecord lié au nouveau Patient
        MedicalRecord record = new MedicalRecord();
        record.setPatient(savedPatient);
        medicalRecordRepository.save(record);

        // 3. Retourner l'entité Patient
        return savedPatient;
    }
}