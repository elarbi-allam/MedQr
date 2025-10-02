package com.medqr.backend.security;

import com.medqr.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Clé secrète stockée dans application.properties (TRÈS IMPORTANTE)
    @Value("${app.jwt.secret}")
    private String secretKey;

    // Durée de validité du token (ex: 24h)
    @Value("${app.jwt.expiration-ms}")
    private long jwtExpiration;


    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // --- Génération de Token ---

    public String generateToken(UserDetails userDetails) {
        // Caste UserDetails vers votre entité User pour accéder à l'ID
        User user = (User) userDetails;

        Map<String, Object> extraClaims = new HashMap<>();

        // 1. Ajoutez le RÔLE (comme claim personnalisé)
        userDetails.getAuthorities().forEach(a -> extraClaims.put("role", a.getAuthority()));

        // C'est l'ID de l'utilisateur qui sera le sujet (sub) du jeton
        String subjectId = user.getUserId().toString();

        return generateToken(extraClaims, subjectId);
    }

    // La méthode privée est simplifiée pour prendre l'ID comme sujet.
    public String generateToken(
            Map<String, Object> extraClaims,
            String subject
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(subject) // Utilise l'ID de l'utilisateur (UUID converti en String)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // --- Validation de Token ---

    public boolean isTokenValid(String token, UserDetails userDetails) {
        // Caste UserDetails vers votre entité User pour obtenir l'ID.
        User user = (User) userDetails;
        final String subjectId = extractSubject(token);

        // Comparaison avec l'ID du UserDetails
        return (subjectId.equals(user.getUserId().toString())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}