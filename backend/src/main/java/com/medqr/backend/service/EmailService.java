package com.medqr.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Envoie l'email de vérification en utilisant la configuration SMTP.
     */
    public void sendVerificationEmail(String recipientEmail, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@medqr.com"); // Adresse d'envoi
            message.setTo(recipientEmail);
            message.setSubject("Vérification de votre compte MedQR");

            String verificationLink = "http://localhost:8080/api/auth/verify?code=" + verificationCode;
            String emailContent = String.format(
                    "Cher utilisateur,\n\n" +
                            "Merci de vous être inscrit à MedQR. Veuillez cliquer sur le lien ci-dessous pour activer votre compte :\n\n" +
                            "%s\n\n" +
                            "Si le lien ne fonctionne pas, utilisez ce code de vérification : %s\n\n" +
                            "Ce code expirera dans 24 heures.\n\n" +
                            "L'équipe MedQR.",
                    verificationLink, verificationCode
            );
            message.setText(emailContent);

            mailSender.send(message);
            log.info("Email de vérification envoyé avec succès à : {}", recipientEmail);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de vérification à {}: {}", recipientEmail, e.getMessage());
            // Il est souvent préférable de ne pas relancer l'exception ici
            // pour permettre à l'utilisateur de s'enregistrer et de réessayer l'envoi plus tard.
            // Si vous relancez, le statut HTTP sera 500.
            // Pour le moment, nous allons laisser l'application continuer.
            // throw new RuntimeException("Échec de l'envoi de l'email.", e);
        }
    }
}