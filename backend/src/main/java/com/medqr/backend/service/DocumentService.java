package com.medqr.backend.service;

import com.medqr.backend.model.Document;
import com.medqr.backend.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    /**
     * Enregistre le document en base de données.
     * @param document Le document à enregistrer.
     * @return Le document enregistré.
     */
    @Transactional
    public Document saveDocument(Document document) {
        return documentRepository.save(document);
    }

    // Ajoutez ici la logique pour getDocumentById, deleteDocument, etc.
}