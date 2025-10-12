// frontend/src/features/facility-prescriptions/actions/facility-actions.ts
"use client";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import axios from "axios";
import {
    FacilityPrescriptionRequestRequest,
    PrescriptionDetailResponse,
    FacilityPrescriptionRequestResponse,
    PaginatedResponse,
} from "../types/facility-prescription.types";

const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];
    return token || null;
};

const clientAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    timeout: 30000,
});

clientAxios.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Scan code and request access (FACILITY)
export const scanCodeAndRequestAccess = async (
    code: string,
    request: FacilityPrescriptionRequestRequest
): Promise<ActionsResponse<null>> => {
    try {
        await clientAxios.post(`/facility-prescriptions/scan-code?code=${code}`, request);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Demande envoyée avec succès",
            data: null,
        };
    } catch (error: any) {
        return errorResponse(error, "scanCodeAndRequestAccess");
    }
};

// Get my approved requests (FACILITY)
export const getMyApprovedRequests = async (
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<FacilityPrescriptionRequestResponse> | null>> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        const response = await clientAxios.get<PaginatedResponse<FacilityPrescriptionRequestResponse>>(
            `/facility-prescriptions/my-approved?${params.toString()}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Demandes approuvées récupérées",
            data: response.data,
        };
    } catch (error: any) {
        return errorResponse(error, "getMyApprovedRequests");
    }
};

// View prescription details (FACILITY)
export const viewPrescriptionDetails = async (
    requestId: string
): Promise<ActionsResponse<PrescriptionDetailResponse | null>> => {
    try {
        const response = await clientAxios.get<PrescriptionDetailResponse>(
            `/facility-prescriptions/${requestId}/prescription/details`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Détails récupérés",
            data: response.data,
        };
    } catch (error: any) {
        return errorResponse(error, "viewPrescriptionDetails");
    }
};

// View prescription document (FACILITY)
export const viewPrescriptionDocument = async (requestId: string): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/facility-prescriptions/${requestId}/prescription`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document récupéré",
            data: response.data as Blob,
        };
    } catch (error: any) {
        return errorResponse(error, "viewPrescriptionDocument");
    }
};

// Upload prescription result (FACILITY)
export const uploadPrescriptionResult = async (
    requestId: string,
    formData: FormData
): Promise<ActionsResponse<null>> => {
    try {
        await clientAxios.post(`/facility-prescriptions/${requestId}/result`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return {
            status: "SUCCESS",
            statusCode: 201,
            message: "Résultat ajouté avec succès",
            data: null,
        };
    } catch (error: any) {
        return errorResponse(error, "uploadPrescriptionResult");
    }
};