package com.medqr.backend.dto.auth;

import com.medqr.backend.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    // --- Champs d'Authentification (pour l'entité User) ---
    @Email(message = "L'email doit être valide")
    @NotBlank(message = "L'email est requis")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;

    @NotNull(message = "Le type d'utilisateur est requis")
    private UserType userType;

    // --- Champs Patient/Provider (Nom/Prénom) ---
    // Ces champs seront validés dans les services si nécessaires
    private String firstName;
    private String lastName;

    // --- Champs Patient Spécifiques ---
    private LocalDate dateOfBirth;
    private String phoneNumber; // Nouveau champ du schéma DB
    private String address;     // Nouveau champ du schéma DB (commun avec Facility)

    // --- Champs Provider Spécifiques ---
    private String specialty;
    private String licenseNumber;

    // --- Champs Facility Spécifiques ---
    private String name;
    private String type; // Ex: Hospital, Lab
}