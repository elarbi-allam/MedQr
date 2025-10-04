package com.medqr.backend.service;

import com.medqr.backend.model.User;
import com.medqr.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Charge l'utilisateur en utilisant le "sujet" (subject) fourni.
     * Le sujet peut être soit l'email (pour la connexion), soit l'ID (UUID)
     * de l'utilisateur (pour la validation du JWT).
     *
     * @param subject L'email ou l'UUID de l'utilisateur.
     * @return L'objet UserDetails (votre entité User).
     * @throws UsernameNotFoundException si l'utilisateur n'est trouvé ni par ID, ni par email.
     */
    @Override
    public UserDetails loadUserByUsername(String subject) throws UsernameNotFoundException {

        Optional<User> userOptional;

        // 1. Tenter de convertir le sujet en UUID. Si réussi, chercher par ID.
        try {
            UUID userId = UUID.fromString(subject);
            userOptional = userRepository.findByUserId(userId);

        } catch (IllegalArgumentException e) {
            // 2. Si la conversion échoue (ce n'est pas un UUID), chercher par Email.
            userOptional = userRepository.findByEmail(subject);
        }

        // 3. Retourner l'utilisateur ou lancer l'exception standard de Spring Security.
        return userOptional
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le sujet (Email/ID) : " + subject));
    }
}