package com.medqr.backend.repository;

import com.medqr.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    // Méthode clé pour la connexion : rechercher un utilisateur par son email
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode); // Pour l'email de vérification
}