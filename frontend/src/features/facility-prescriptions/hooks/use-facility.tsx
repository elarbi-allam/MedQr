// frontend/src/features/facility-prescriptions/hooks/use-facility.tsx
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    scanCodeAndRequestAccess,
    getMyApprovedRequests,
    viewPrescriptionDetails,
    viewPrescriptionDocument,
    uploadPrescriptionResult,
} from "../actions/facility-actions";

export function useScanCodeAndRequestAccess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ code, request }: { code: string; request: any }) =>
            scanCodeAndRequestAccess(code, request),
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["my-approved-requests"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useMyApprovedRequests(page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["my-approved-requests", page, size],
        queryFn: () => getMyApprovedRequests(page, size),
        staleTime: 1000 * 60,
    });
}

export function useViewPrescriptionDetails(requestId: string) {
    return useQuery({
        queryKey: ["prescription-details", requestId],
        queryFn: () => viewPrescriptionDetails(requestId),
        enabled: !!requestId,
    });
}

export function useViewPrescriptionDocument() {
    return useMutation({
        mutationFn: viewPrescriptionDocument,
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
    });
}

export function useUploadPrescriptionResult() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ requestId, formData }: { requestId: string; formData: FormData }) =>
            uploadPrescriptionResult(requestId, formData),
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["my-approved-requests"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}