"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    addMedicationForPatient,
    getPatientMedications,
    updateMedication,
} from "../actions/provider-medication-actions";
import { MedicationFormData } from "../types/medication-vaccination.types";

export function usePatientMedications(patientId: string, currentOnly: boolean = false, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["patient-medications", patientId, currentOnly, page, size],
        queryFn: () => getPatientMedications(patientId, currentOnly, page, size),
        enabled: !!patientId,
        staleTime: 1000 * 60 * 2,
    });
}

export function useAddMedicationForPatient(patientId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: MedicationFormData) => addMedicationForPatient(patientId, data),
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["patient-medications", patientId] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

export function useUpdateMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ medicationId, data }: { medicationId: string; data: MedicationFormData }) =>
            updateMedication(medicationId, data),
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["patient-medications"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}