"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getProviderPatients,
    getPatientDocumentsAsProvider,
    requestAccessWithCode,
    createPrescription,
    getPatientPrescriptions,
    completePrescription,
} from "../actions/provider-actions";
import {
    viewProviderPatientDocumentClient,
    downloadProviderPatientDocumentClient,
} from "../actions/client-document-actions";

export function useProviderPatients() {
    return useQuery({
        queryKey: ["provider-patients"],
        queryFn: () => getProviderPatients(),
        staleTime: 1000 * 60 * 5,
    });
}

export function usePatientDocumentsAsProvider(patientId: string, page: number = 0, size: number = 5) {
    return useQuery({
        queryKey: ["provider-patient-documents", patientId, page, size],
        queryFn: () => getPatientDocumentsAsProvider(patientId, page, size),
        enabled: !!patientId,
        staleTime: 1000 * 60 * 2,
    });
}

export function usePatientPrescriptions(patientId: string, isCompleted?: boolean | null, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["patient-prescriptions", patientId, isCompleted, page, size],
        queryFn: () => getPatientPrescriptions(patientId, isCompleted, page, size),
        enabled: !!patientId,
        staleTime: 1000 * 60 * 2,
    });
}

export function useRequestAccessWithCode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: requestAccessWithCode,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["provider-patients"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useCreatePrescription(patientId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => createPrescription(patientId, formData),
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["provider-patient-documents", patientId] });
                queryClient.invalidateQueries({ queryKey: ["patient-prescriptions", patientId] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useCompletePrescription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completePrescription,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["patient-prescriptions"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useViewProviderPatientDocument() {
    return useMutation({
        mutationFn: ({ patientId, documentId }: { patientId: string; documentId: string }) =>
            viewProviderPatientDocumentClient(patientId, documentId),
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
            toast.error("Erreur: " + (error instanceof Error ? error.message : "Impossible de visualiser"));
        },
    });
}

export function useDownloadProviderPatientDocument() {
    return useMutation({
        mutationFn: ({ patientId, documentId }: { patientId: string; documentId: string }) =>
            downloadProviderPatientDocumentClient(patientId, documentId),
        onSuccess: (data, variables) => {
            if (data.status === "SUCCESS" && data.data) {
                try {
                    const blob = data.data;
                    const blobUrl = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = `patient_${variables.patientId}_doc_${variables.documentId}.pdf`;
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
                toast.error(data.message || "Impossible de télécharger");
            }
        },
        onError: (error: unknown) => {
            console.error("Download error:", error);
            toast.error("Erreur: " + (error instanceof Error ? error.message : "Impossible de télécharger"));
        },
    });
}