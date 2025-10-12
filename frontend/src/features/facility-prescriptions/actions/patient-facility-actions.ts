// frontend/src/features/facility-prescriptions/actions/patient-facility-actions.ts
"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
    FacilityAccessCodeResponse,
    FacilityPrescriptionRequestResponse,
    PaginatedResponse,
} from "../types/facility-prescription.types";

// Generate access code for prescription (PATIENT)
export async function generatePrescriptionAccessCode(
    prescriptionId: string
): Promise<ActionsResponse<FacilityAccessCodeResponse | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<FacilityAccessCodeResponse>(
            `/facility-prescriptions/generate-code?prescriptionId=${prescriptionId}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Code d'accès généré",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "generatePrescriptionAccessCode");
    }
}

// Get my pending facility requests (PATIENT)
export async function getMyPendingFacilityRequests(
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<FacilityPrescriptionRequestResponse> | null>> {
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

        const response = await axiosWrapper.get<PaginatedResponse<FacilityPrescriptionRequestResponse>>(
            `/facility-prescriptions/my-pending-requests?${params.toString()}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Demandes récupérées",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getMyPendingFacilityRequests");
    }
}

// Get requests for specific prescription (PATIENT)
export async function getRequestsForPrescription(
    prescriptionId: string
): Promise<ActionsResponse<FacilityPrescriptionRequestResponse[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<FacilityPrescriptionRequestResponse[]>(
            `/facility-prescriptions/prescription/${prescriptionId}/requests`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Demandes récupérées",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getRequestsForPrescription");
    }
}

// Approve facility request (PATIENT)
export async function approveFacilityRequest(requestId: string): Promise<ActionsResponse<null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        await axiosWrapper.put(`/facility-prescriptions/approve/${requestId}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Demande approuvée avec succès",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "approveFacilityRequest");
    }
}

// Reject facility request (PATIENT)
export async function rejectFacilityRequest(requestId: string): Promise<ActionsResponse<null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        await axiosWrapper.put(`/facility-prescriptions/reject/${requestId}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Demande rejetée",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "rejectFacilityRequest");
    }
}