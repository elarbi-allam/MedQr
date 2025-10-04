package com.medqr.backend.service;

import com.medqr.backend.exception.FileNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    // Récupère le chemin depuis application.properties
    public FileStorageService(@Value("${file.upload.dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            // Crée le répertoire s'il n'existe pas
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de créer le répertoire de stockage.", ex);
        }
    }

    /**
     * Enregistre un fichier et retourne son chemin relatif sécurisé.
     */
    public String storeFile(MultipartFile file, UUID patientId) {
        // Crée un répertoire spécifique au patient (pour l'organisation et la sécurité)
        Path patientDirPath = this.fileStorageLocation.resolve(patientId.toString());
        try {
            Files.createDirectories(patientDirPath);
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le répertoire pour le patient.", e);
        }

        // Utilise un nom de fichier unique (UUID) pour éviter les conflits et la spéculation
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + fileExtension;
        Path targetLocation = patientDirPath.resolve(filename);

        try {
            // Copie le fichier dans le chemin cible
            Files.copy(file.getInputStream(), targetLocation);
            // Stocke le chemin RELATIF pour des raisons de sécurité et de portabilité.
            return patientId.toString() + "/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Échec de l'enregistrement du fichier : " + filename, ex);
        }
    }

    /**
     * Charge le fichier sous forme de ressource pour être streamé.
     */
    public Resource loadFileAsResource(String relativeFilePath) {
        try {
            Path targetLocation = this.fileStorageLocation.resolve(relativeFilePath).normalize();
            Resource resource = new UrlResource(targetLocation.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("Fichier non trouvé à l'emplacement : " + relativeFilePath);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("Fichier non trouvé (URL malformée) : " + relativeFilePath, ex);
        }
    }
}