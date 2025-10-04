package com.medqr.backend.config;

import com.medqr.backend.security.CustomAccessDeniedHandler;
import com.medqr.backend.security.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Désactiver le CSRF (nouvelle syntaxe lambda)
                .csrf(csrf -> csrf.disable())

                .exceptionHandling(exception -> exception
                                // Gère le 403 Forbidden (utilisateur authentifié, mais non autorisé)
                                .accessDeniedHandler(customAccessDeniedHandler)

                        .authenticationEntryPoint(customAuthenticationEntryPoint))

                // 2. Définir les règles d'autorisation (nouvelle syntaxe authorizeHttpRequests)
                .authorizeHttpRequests(authorize -> authorize
                        // Permettre l'accès aux endpoints d'auth
                        .requestMatchers("/api/auth/**").permitAll()
                        // Utilisation de .requestMatchers() à la place de .antMatchers()

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()
                )

                // 3. Rendre Spring Security "stateless" (nouvelle syntaxe lambda)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. Définir le fournisseur d'authentification
                .authenticationProvider(authenticationProvider)

                // 5. Ajouter notre filtre JWT
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}