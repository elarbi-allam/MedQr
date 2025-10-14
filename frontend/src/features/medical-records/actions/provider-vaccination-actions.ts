"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { VaccinationType, VaccinationFormData } from "../types/medication-vaccination.types";
import { PaginatedResponse } from "../types/medical-record.types";
// Add vaccination for a patient
export async function addVaccinationForPatient(
    patientId: string,
    data: VaccinationFormData
): Promise<ActionsResponse<VaccinationType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<VaccinationType>(
            `/vaccinations/patient/${patientId}`,
            data
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Vaccination ajoutée avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "addVaccinationForPatient");
    }
}

// Get vaccinations for a patient (provider view)
export async function getPatientVaccinations(
    patientId: string,
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<VaccinationType> | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        const response = await axiosWrapper.get<PaginatedResponse<VaccinationType>>(
            `/vaccinations/patient/${patientId}?${params.toString()}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Vaccinations récupérées",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPatientVaccinations");
    }
}