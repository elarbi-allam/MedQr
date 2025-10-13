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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Liste des origines autorisées (ajoutez votre URL de production ici)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",                    // Développement local
                "https://votre-app.vercel.app",            // Vercel
                "https://votre-domaine.com"                // Votre domaine de production
        ));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));

        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Cache-Control",
                "Pragma"
        ));

        // Headers exposés au frontend
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));

        // Autoriser les credentials (cookies, tokens)
        configuration.setAllowCredentials(true);

        // Durée de cache pour les préflight requests
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Configuration CORS avec le bean dédié
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Désactiver CSRF (non nécessaire pour les APIs stateless + JWT)
                .csrf(csrf -> csrf.disable())

                // 3. Gestion des exceptions (401/403)
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )

                // 4. Règles d'autorisation
                .authorizeHttpRequests(authorize -> authorize
                        // Endpoints publics (sans authentification)
                        .requestMatchers(
                                "/api/auth/**",                    // Authentification
                                "/v3/api-docs/**",                // Documentation OpenAPI
                                "/swagger-ui/**",                 // Interface Swagger
                                "/swagger-ui.html",               // Page Swagger
                                "/swagger-resources/**",          // Ressources Swagger
                                "/webjars/**"                     // WebJars pour Swagger
                        ).permitAll()

                        // Endpoints patients
                        .requestMatchers("/api/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/profile/patient").hasRole("PATIENT")

                        // Endpoints providers
                        .requestMatchers("/api/provider/**").hasRole("PROVIDER")
                        .requestMatchers("/api/profile/provider").hasRole("PROVIDER")

                        // Endpoints facilities (CORRIGÉ : j'ai ajouté les endpoints manquants)
                        .requestMatchers("/api/facility/**").hasRole("FACILITY")
                        .requestMatchers("/api/profile/facility").hasRole("FACILITY")

                        // Changement de mot de passe (accessible à tous les utilisateurs authentifiés)
                        .requestMatchers("/api/profile/change-password").authenticated()

                        // Endpoints de santé (optionnel - pour vérifier que l'API est en ligne)
                        .requestMatchers("/api/health", "/actuator/health").permitAll()

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()
                )

                // 5. Gestion de session (STATELESS pour JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 6. Filtre JWT (s'exécute avant l'authentification standard)
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}