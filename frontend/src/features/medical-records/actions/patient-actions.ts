"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { DocumentDataType, QRCodeDataType, AccessRequestType, PaginatedResponse, PrescriptionType } from "../types/medical-record.types";

// Get patient's documents with pagination
export async function getPatientDocuments(
    type?: string,
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<DocumentDataType> | null>> {
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
        
        if (type) {
            params.append("type", type);
        }

        const response = await axiosWrapper.get<PaginatedResponse<DocumentDataType>>(
            `/patient/record/documents?${params.toString()}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Documents récupérés",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPatientDocuments");
    }
}

// Get patient's prescriptions with pagination and filter
export async function getPatientPrescriptions(
    isCompleted?: boolean | null,
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<PrescriptionType> | null>> {
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
        
        if (isCompleted !== undefined && isCompleted !== null) {
            params.append("isCompleted", isCompleted.toString());
        }

        const response = await axiosWrapper.get<PaginatedResponse<PrescriptionType>>(
            `/patient/prescriptions?${params.toString()}`
        );

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

// Upload patient document
export async function uploadPatientDocument(formData: FormData): Promise<ActionsResponse<DocumentDataType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<DocumentDataType>("/patient/record/documents", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document téléchargé avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "uploadPatientDocument");
    }
}

// Generate QR code
export async function generateAccessCode(): Promise<ActionsResponse<QRCodeDataType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<QRCodeDataType>("/access/generate-code");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Code d'accès généré",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "generateAccessCode");
    }
}

// Get pending access requests
export async function getPendingAccessRequests(): Promise<ActionsResponse<AccessRequestType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<AccessRequestType[]>("/access/pending-requests");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Demandes récupérées",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPendingAccessRequests");
    }
}

// Approve access request
export async function approveAccessRequest(requestId: string): Promise<ActionsResponse<null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        await axiosWrapper.put(`/access/approve/${requestId}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Accès approuvé avec succès",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "approveAccessRequest");
    }
}

// Reject access request
export async function rejectAccessRequest(requestId: string): Promise<ActionsResponse<null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        await axiosWrapper.put(`/access/reject/${requestId}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Demande rejetée",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "rejectAccessRequest");
    }
}