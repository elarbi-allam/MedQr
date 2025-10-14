"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    addVaccinationForPatient,
    getPatientVaccinations,
} from "../actions/provider-vaccination-actions";
import { VaccinationFormData } from "../types/medication-vaccination.types";

export function usePatientVaccinations(patientId: string, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["patient-vaccinations", patientId, page, size],
        queryFn: () => getPatientVaccinations(patientId, page, size),
        enabled: !!patientId,
        staleTime: 1000 * 60 * 2,
    });
}

export function useAddVaccinationForPatient(patientId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VaccinationFormData) => addVaccinationForPatient(patientId, data),
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["patient-vaccinations", patientId] });
            } else {
                toast.error(data.message);
            }
        },
    });
}