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

    // --- Champs Spécifiques (pour l'entité Patient, HealthcareProvider ou Facility) ---
    @NotBlank(message = "Le prénom est requis")
    private String firstName;

    @NotBlank(message = "Le nom de famille est requis")
    private String lastName;

    private LocalDate dateOfBirth;

    // Champ spécifique pour le HealthcareProvider/Facility
    // (Utilisé pour la spécialité ou le nom de la clinique)
    private String specificDetail;
}