package com.medqr.backend.service;

import com.medqr.backend.config.AppConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final AppConfig appConfig;

    /**
     * Envoie l'email de vérification avec template HTML stylisé
     */
    public void sendVerificationEmail(String recipientEmail, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("mema63397@gmail.com", appConfig.getAppName());
            helper.setTo(recipientEmail);
            helper.setSubject("Activez votre compte " + appConfig.getAppName());

            String emailContent = buildVerificationEmail(verificationCode);
            helper.setText(emailContent, true); // true pour indiquer que c'est du HTML

            mailSender.send(message);
            log.info("Email de vérification HTML envoyé avec succès à : {}", recipientEmail);

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de vérification à {}: {}", recipientEmail, e.getMessage());
        }
    }

    /**
     * Construit le contenu HTML de l'email de vérification
     */
    private String buildVerificationEmail(String verificationCode) {
        try {
            // Charger le template HTML
            ClassPathResource resource = new ClassPathResource("templates/email-verification.html");
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

            // Générer le lien de vérification
            String verificationLink = appConfig.getBaseUrl() + "/api/auth/verify?code=" + verificationCode;

            // Remplacer les placeholders
            return template
                    .replace("${appName}", appConfig.getAppName())
                    .replace("${verificationLink}", verificationLink)
                    .replace("${verificationCode}", verificationCode)
                    .replace("${baseUrl}", appConfig.getBaseUrl());

        } catch (Exception e) {
            log.error("Erreur lors du chargement du template d'email, utilisation du template par défaut", e);
            return buildDefaultVerificationEmail(verificationCode);
        }
    }

    /**
     * Template par défaut si le fichier HTML n'est pas trouvé
     */
    private String buildDefaultVerificationEmail(String verificationCode) {
        String verificationLink = appConfig.getBaseUrl() + "/api/auth/verify?code=" + verificationCode;

        return String.format(
                """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; margin-bottom: 30px; }
                        .logo { color: #2563eb; font-size: 24px; font-weight: bold; }
                        .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .code { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
                        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">%s</div>
                            <h2>Activez votre compte</h2>
                        </div>
                        
                        <p>Cher utilisateur,</p>
                        
                        <p>Merci de vous être inscrit à <strong>%s</strong>. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                        
                        <div style="text-align: center;">
                            <a href="%s" class="button">Activer mon compte</a>
                        </div>
                        
                        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
                        <div class="code">%s</div>
                        
                        <p>Si le bouton ne fonctionne pas, vous pouvez utiliser ce code de vérification :</p>
                        <div class="code">%s</div>
                        
                        <p><strong>Attention :</strong> Ce code expirera dans 24 heures.</p>
                        
                        <div class="footer">
                            <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
                            <p>L'équipe %s</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                appConfig.getAppName(),
                appConfig.getAppName(),
                verificationLink,
                verificationLink,
                verificationCode,
                appConfig.getAppName()
        );
    }
}