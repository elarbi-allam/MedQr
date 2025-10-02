package com.medqr.backend.service;

import com.medqr.backend.model.Patient;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    /**
     * Crée une entité Patient liée à un User nouvellement inscrit.
     */
    public Patient createPatient(User user, String firstName, String lastName, java.time.LocalDate dateOfBirth) {
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setDateOfBirth(dateOfBirth);
        // Les autres champs (adresse, phone) khassni n implementehom o njerihom darori

        return patientRepository.save(patient);
    }
}