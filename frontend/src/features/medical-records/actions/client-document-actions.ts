//frontend\src\features\medical-records\actions\client-document-actions.ts
"use client";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import axios from "axios";

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
    (error) => Promise.reject(error),
);

clientAxios.interceptors.response.use(
    (response) => {
        if (response.config.responseType === "blob" && response.data instanceof Blob) {
            const contentDisposition = response.headers["content-disposition"];
            let filename = "";
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (matches && matches[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }
            (response.data as any).filename = filename;
            (response.data as any).contentType = response.headers["content-type"] || "application/octet-stream";
        }
        return response;
    },
    (error) => Promise.reject(error),
);

// View patient document
export const viewPatientDocumentClient = async (documentId: string): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/patient/record/documents/${documentId}/view`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document récupéré",
            data: response.data as Blob,
        };
    } catch (error: any) {
        return errorResponse(error, "viewPatientDocumentClient");
    }
};

// Download patient document
export const downloadPatientDocumentClient = async (documentId: string): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/patient/record/documents/${documentId}/view`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document téléchargé",
            data: response.data as Blob,
        };
    } catch (error: any) {
        return errorResponse(error, "downloadPatientDocumentClient");
    }
};

// View provider patient document
export const viewProviderPatientDocumentClient = async (
    patientId: string,
    documentId: string,
): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/provider/patients/${patientId}/documents/${documentId}/view`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document récupéré",
            data: response.data as Blob,
        };
    } catch (error: any) {
        return errorResponse(error, "viewProviderPatientDocumentClient");
    }
};

// Download provider patient document
export const downloadProviderPatientDocumentClient = async (
    patientId: string,
    documentId: string,
): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/provider/patients/${patientId}/documents/${documentId}/view`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document téléchargé",
            data: response.data as Blob,
        };
    } catch (error: any) {
        return errorResponse(error, "downloadProviderPatientDocumentClient");
    }
};
