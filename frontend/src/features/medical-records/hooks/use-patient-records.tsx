// frontend/src/features/medical-records/hooks/use-patient-records.tsx
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getPatientDocuments,
    uploadPatientDocument,
    generateAccessCode,
    getPendingAccessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    getPatientPrescriptions,
} from "../actions/patient-actions";
import { viewPatientDocumentClient, downloadPatientDocumentClient } from "../actions/client-document-actions";

export function usePatientDocuments(type?: string, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["patient-documents", type, page, size],
        queryFn: () => getPatientDocuments(type, page, size),
        staleTime: 1000 * 60 * 2,
    });
}

export function usePatientPrescriptions(isCompleted?: boolean | null, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["patient-prescriptions", isCompleted, page, size],
        queryFn: () => getPatientPrescriptions(isCompleted, page, size),
        staleTime: 1000 * 60 * 2,
    });
}

export function useUploadPatientDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadPatientDocument,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["patient-documents"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useGenerateAccessCode() {
    return useMutation({
        mutationFn: generateAccessCode,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function usePendingAccessRequests() {
    return useQuery({
        queryKey: ["pending-access-requests"],
        queryFn: () => getPendingAccessRequests(),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 30,
    });
}

export function useApproveAccessRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveAccessRequest,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["pending-access-requests"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useRejectAccessRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectAccessRequest,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["pending-access-requests"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useViewPatientDocument() {
    return useMutation({
        mutationFn: viewPatientDocumentClient,
        onSuccess: (data) => {
            if (data.status === "SUCCESS" && data.data) {
                try {
                    const blob = data.data;
                    const blobUrl = window.URL.createObjectURL(blob);

                    const newWindow = window.open(blobUrl, "_blank");

                    if (!newWindow) {
                        toast.error("Veuillez autoriser les pop-ups pour voir le document");
                        window.URL.revokeObjectURL(blobUrl);
                    } else {
                        toast.success("Document ouvert");
                        setTimeout(() => {
                            window.URL.revokeObjectURL(blobUrl);
                        }, 5000);
                    }
                } catch (err) {
                    console.error("Error opening document:", err);
                    toast.error("Erreur lors de l'ouverture du document");
                }
            } else {
                toast.error(data.message || "Impossible de récupérer le document");
            }
        },
        onError: (error: unknown) => {
            console.error("View error:", error);
            toast.error("Erreur: " + (error instanceof Error ? error.message : "Impossible de visualiser le document"));
        },
    });
}

export function useDownloadPatientDocument() {
    return useMutation({
        mutationFn: downloadPatientDocumentClient,
        onSuccess: (data, variables) => {
            if (data.status === "SUCCESS" && data.data) {
                try {
                    const blob = data.data;
                    const blobUrl = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = `document_${variables}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    window.URL.revokeObjectURL(blobUrl);
                    toast.success("Document téléchargé");
                } catch (err) {
                    console.error("Error downloading:", err);
                    toast.error("Erreur lors du téléchargement");
                }
            } else {
                toast.error(data.message || "Impossible de télécharger le document");
            }
        },
        onError: (error: unknown) => {
            console.error("Download error:", error);
            toast.error("Erreur: " + (error instanceof Error ? error.message : "Impossible de télécharger"));

        },
    });
}