"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import getDocuments, {
    getDocument,
    getMyDocuments,
    updateDocumentStatus,
    uploadEnterpriseDocument,
    uploadTruckDocument,
} from "../actions/document-actions";
import { downloadDocumentClient, viewDocumentClient } from "../actions/client-document-actions";
import { DocumentParams } from "../types/document.type";

export function useDocuments(params: DocumentParams) {
    return useQuery({
        queryKey: ["documents", params],
        queryFn: () => getDocuments(params),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
}

export function useDocument(id: string) {
    return useQuery({
        queryKey: ["documents", id],
        queryFn: () => getDocument(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useMyDocuments() {
    return useQuery({
        queryKey: ["my-documents"],
        queryFn: () => getMyDocuments(),
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateDocumentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDocumentStatus,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "documents" || query.queryKey[0] === "my-documents",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useUploadEnterpriseDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadEnterpriseDocument,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === "required-document-templates" ||
                        query.queryKey[0] === "my-documents" ||
                        query.queryKey[0] === "verification-status",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useUploadTruckDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadTruckDocument,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === "required-truck-document-templates" ||
                        query.queryKey[0] === "my-documents",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// Fonction utilitaire pour déterminer l'extension du fichier basée sur le content-type
const getFileExtension = (contentType: string): string => {
    const extensionMap: Record<string, string> = {
        "application/pdf": "pdf",
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
    };
    return extensionMap[contentType] || "bin";
};

// Fonction utilitaire pour vérifier si le type de fichier peut être affiché dans le navigateur
const canViewInBrowser = (contentType: string): boolean => {
    const viewableTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    return viewableTypes.includes(contentType);
};

export function useDownloadDocument() {
    return useMutation({
        mutationFn: downloadDocumentClient,
        onSuccess: (data, variables) => {
            if (data.status === "SUCCESS" && data.data) {
                const blob = data.data;

                // Récupérer les métadonnées du blob ajoutées par l'interceptor
                const contentType =
                    (blob as unknown as { contentType: string }).contentType || "application/octet-stream";
                const filename = (blob as unknown as { filename: string }).filename || "";

                // Créer l'URL du blob
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;

                // Déterminer le nom du fichier
                let finalFilename = filename;
                if (!finalFilename) {
                    const extension = getFileExtension(contentType);
                    finalFilename = `document-${variables}.${extension}`;
                }

                link.download = finalFilename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Erreur lors du téléchargement du document");
        },
    });
}

// View document in new tab
export function useViewDocument() {
    return useMutation({
        mutationFn: viewDocumentClient,
        onSuccess: (data, variables) => {
            if (data.status === "SUCCESS" && data.data) {
                const blob = data.data;

                // Récupérer le content-type du blob
                const contentType =
                    (blob as unknown as { contentType: string }).contentType || "application/octet-stream";

                // Vérifier si le fichier peut être affiché dans le navigateur
                if (canViewInBrowser(contentType)) {
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, "_blank");

                    // Nettoyer l'URL après un délai
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 1000);

                    toast.success(data.message);
                } else {
                    // Si le fichier ne peut pas être visualisé, proposer le téléchargement
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;

                    const filename = (blob as unknown as { filename: string }).filename || "";
                    const extension = getFileExtension(contentType);
                    const finalFilename = filename || `document-${variables}.${extension}`;

                    link.download = finalFilename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    toast.info("Ce type de fichier ne peut pas être visualisé. Téléchargement automatique...");
                }
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Erreur lors de la visualisation du document");
        },
    });
}
