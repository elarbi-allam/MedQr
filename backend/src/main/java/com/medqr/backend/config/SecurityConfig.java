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
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays; // Ajouté pour Arrays.asList

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
                // 1. GESTION CORS INTÉGRÉE (C'est la solution!)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    // Assurez-vous d'utiliser Arrays.asList() pour les listes
                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                    config.setAllowCredentials(true);
                    config.setMaxAge(3600L); // Temps de cache pour le preflight
                    return config;
                }))

                // 2. Désactiver CSRF
                .csrf(csrf -> csrf.disable())

                // 3. Gestion des exceptions (401/403)
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint))

                // 4. Règles d'autorisation
                .authorizeHttpRequests(authorize -> authorize
                        // Endpoints publics
                        .requestMatchers("/api/auth/**").permitAll()

                        // Endpoints patients
                        .requestMatchers("/api/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/profile/patient").hasRole("PATIENT")

                        // Endpoints providers
                        .requestMatchers("/api/provider/**").hasRole("PROVIDER")
                        .requestMatchers("/api/profile/provider").hasRole("PROVIDER")

                        // Endpoints facilities
                        .requestMatchers("/api/profile/facility").hasRole("FACILITY")

                        // Changement de mot de passe (accessible à tous les utilisateurs authentifiés)
                        .requestMatchers("/api/profile/change-password").authenticated()

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()
                )

                // 5. Gestion de session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 6. Filtre JWT
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
