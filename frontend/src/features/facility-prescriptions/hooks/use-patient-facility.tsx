"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    generatePrescriptionAccessCode,
    getMyPendingFacilityRequests,
    getRequestsForPrescription,
    approveFacilityRequest,
    rejectFacilityRequest,
} from "../actions/patient-facility-actions";

export function useGeneratePrescriptionAccessCode() {
    return useMutation({
        mutationFn: generatePrescriptionAccessCode,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useMyPendingFacilityRequests(page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["my-pending-facility-requests", page, size],
        queryFn: () => getMyPendingFacilityRequests(page, size),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 30,
    });
}

export function useRequestsForPrescription(prescriptionId: string) {
    return useQuery({
        queryKey: ["prescription-facility-requests", prescriptionId],
        queryFn: () => getRequestsForPrescription(prescriptionId),
        enabled: !!prescriptionId,
        staleTime: 1000 * 30,
    });
}

export function useApproveFacilityRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveFacilityRequest,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["my-pending-facility-requests"] });
                queryClient.invalidateQueries({ queryKey: ["prescription-facility-requests"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useRejectFacilityRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectFacilityRequest,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["my-pending-facility-requests"] });
                queryClient.invalidateQueries({ queryKey: ["prescription-facility-requests"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}