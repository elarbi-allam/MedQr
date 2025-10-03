package com.medqr.backend.service;

import com.medqr.backend.dto.auth.AuthenticationRequest;
import com.medqr.backend.dto.auth.AuthenticationResponse;
import com.medqr.backend.dto.auth.RegisterRequest;
import com.medqr.backend.enums.UserType;
import com.medqr.backend.model.User;
import com.medqr.backend.repository.UserRepository;
import com.medqr.backend.security.JwtService;
import com.medqr.backend.utils.CodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // Services spécifiques (Nécessitent d'être injectés)
    private final PatientService patientService;
    private final ProviderService providerService;
    private final FacilityService facilityService;

    /**
     * Gère l'inscription d'un nouvel utilisateur.
     */
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Vérification de l'existence de l'utilisateur
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("L'utilisateur avec cet email existe déjà.");
        }

        // 2. Création de l'entité User
        String verificationCode = CodeGenerator.generateAlphaNumericCode(15);

        var user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserType(request.getUserType());
        user.setVerified(false); // Non vérifié par défaut
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusDays(1)); // Valide pour 1 jour


        User savedUser = userRepository.save(user);

        // 3. Création de l'entité spécifique (Délégation et Validation Conditionnelle)
        switch (request.getUserType()) {
            case PATIENT:
                patientService.createPatient(savedUser, request);
                break;
            case PROVIDER:
                providerService.createProvider(savedUser, request);
                break;
            case FACILITY:
                facilityService.createFacility(savedUser, request);
                break;
        }

        // --- 4. Envoi de l'email de vérification ---
        // L'EmailService log l'erreur si l'envoi échoue et NE relance PAS d'exception (approche recommandée ici).
        emailService.sendVerificationEmail(request.getEmail(), verificationCode);

        // --- 5. Réponse ---
        // Ne renvoyons PAS de token ici car le compte est non vérifié.
        // Le client DOIT se connecter après la vérification.

        return AuthenticationResponse.builder()
                .message("Inscription réussie. Un email de vérification a été envoyé.")
                .build();
    }

    /**
     * Gère la connexion d'un utilisateur existant.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) throws AuthenticationException {

        // 1. Authentification via Spring Security (vérifie le mot de passe et l'état isEnabled)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Récupération de l'utilisateur (l'authentification a réussi)
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication success (logic error)"));

        // 3. Génération du JWT
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userType(user.getUserType().name())
                .message("Connexion réussie.")
                .build();
    }

    /**
     * Gère la vérification d'email via le code.
     */
    @Transactional
    public boolean verifyEmail(String code) {
        var userOptional = userRepository.findByVerificationCode(code);

        if (userOptional.isEmpty()) {
            return false; // Code invalide (géré par 400 BAD_REQUEST dans le Controller)
        }

        User user = userOptional.get();

        if (user.isVerified()) {
            // Le compte est déjà vérifié
            throw new IllegalStateException("Ce compte est déjà vérifié."); // Géré par 403 FORBIDDEN
        }

        // Vérification de l'expiration du code
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Le code de vérification a expiré."); // Géré par 403 FORBIDDEN
        }

        // Vérification réussie : Activation du compte
        user.setVerified(true);
        user.setVerificationCode(null); // Nettoyer le code
        user.setVerificationCodeExpiresAt(null); // Nettoyer l'expiration
        userRepository.save(user);

        return true;
    }
}