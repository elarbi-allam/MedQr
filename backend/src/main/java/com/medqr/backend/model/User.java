package com.medqr.backend.model;

import com.medqr.backend.enums.UserType; // Créez ce package/Enum si ce n'est pas fait
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "app_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash; // Renommé pour être plus explicite que 'password'

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    // Champs pour la vérification par e-mail
    @Column(nullable = false)
    private boolean isVerified = false;


    private String verificationCode; // Code temporaire envoyé par email

    private LocalDateTime verificationCodeExpiresAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    // --- Implémentation de UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Le rôle est basé sur le UserType (ex: ROLE_PATIENT, ROLE_PROVIDER)
        return List.of(new SimpleGrantedAuthority("ROLE_" + userType.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email; // Utiliser l'email comme nom d'utilisateur pour l'authentification
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isVerified; // L'utilisateur n'est activé que s'il est vérifié
    }
}