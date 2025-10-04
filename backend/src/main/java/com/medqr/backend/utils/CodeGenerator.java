package com.medqr.backend.utils;

import java.security.SecureRandom;
import java.util.UUID;

public class CodeGenerator {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom random = new SecureRandom();

    /**
     * Génère un code alphanumérique aléatoire de la longueur spécifiée.
     */
    public static String generateAlphaNumericCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    /**
     * Génère un code d'accès pour QR code (plus court et lisible).
     */
    public static String generateAccessCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}