"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { MedicationType, MedicationFormData } from "../types/medication-vaccination.types";
import { PaginatedResponse } from "../types/medical-record.types";


// Add medication for a patient
export async function addMedicationForPatient(
    patientId: string,
    data: MedicationFormData
): Promise<ActionsResponse<MedicationType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<MedicationType>(
            `/medications/patient/${patientId}`,
            data
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Médicament ajouté avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "addMedicationForPatient");
    }
}

// Get medications for a patient (provider view)
export async function getPatientMedications(
    patientId: string,
    currentOnly: boolean = false,
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<MedicationType> | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const params = new URLSearchParams({
            currentOnly: currentOnly.toString(),
            page: page.toString(),
            size: size.toString(),
        });

        const response = await axiosWrapper.get<PaginatedResponse<MedicationType>>(
            `/medications/patient/${patientId}?${params.toString()}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Médicaments récupérés",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPatientMedications");
    }
}

// Update medication
export async function updateMedication(
    medicationId: string,
    data: MedicationFormData
): Promise<ActionsResponse<MedicationType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.put<MedicationType>(
            `/medications/${medicationId}`,
            data
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Médicament mis à jour",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateMedication");
    }
}