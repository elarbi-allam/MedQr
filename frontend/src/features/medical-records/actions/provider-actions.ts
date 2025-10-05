// frontend/src/features/medical-records/actions/provider-actions.ts
"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { PatientType, DocumentDataType, PrescriptionType } from "../types/medical-record.types";

// Get provider's patients
export async function getProviderPatients(): Promise<ActionsResponse<PatientType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<PatientType[]>("/provider/patients");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Patients récupérés",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getProviderPatients");
    }
}

// Get patient documents
export async function getPatientDocumentsAsProvider(
    patientId: string,
): Promise<ActionsResponse<DocumentDataType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<DocumentDataType[]>(`/provider/patients/${patientId}/documents`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Documents récupérés",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPatientDocumentsAsProvider");
    }
}

// Request access with code
export async function requestAccessWithCode(code: string): Promise<ActionsResponse<null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        await axiosWrapper.post(`/access/request-access?code=${code}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Demande d'accès envoyée",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "requestAccessWithCode");
    }
}

// Create prescription
export async function createPrescription(
    patientId: string,
    formData: FormData,
): Promise<ActionsResponse<PrescriptionType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<PrescriptionType>(
            `/provider/patients/${patientId}/prescriptions`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Ordonnance créée avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "createPrescription");
    }
}

// Get patient prescriptions
export async function getPatientPrescriptions(patientId: string): Promise<ActionsResponse<PrescriptionType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<PrescriptionType[]>(`/provider/patients/${patientId}/prescriptions`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Ordonnances récupérées",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPatientPrescriptions");
    }
}

// Mark prescription as complete
export async function completePrescription(prescriptionId: string): Promise<ActionsResponse<PrescriptionType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.put<PrescriptionType>(`/provider/prescriptions/${prescriptionId}/complete`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Ordonnance marquée comme complétée",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "completePrescription");
    }
}
