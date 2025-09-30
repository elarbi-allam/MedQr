"use client";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import axios from "axios";

// Fonction pour récupérer le token depuis les cookies côté client
const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="))
        ?.split("=")[1];

    return token || null;
};

// Instance axios côté client
const clientAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010",
    timeout: 30000,
});

// Interceptor pour ajouter le token
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

// Interceptor pour traiter les réponses blob
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

            (response.data as unknown as { filename: string }).filename = filename;
            (response.data as unknown as { contentType: string }).contentType =
                response.headers["content-type"] || "application/octet-stream";
        }
        return response;
    },
    (error) => Promise.reject(error),
);

// Actions côté client
export const downloadDocumentClient = async (id: string): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/documents/${id}/content`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document téléchargé avec succès",
            data: response.data as Blob,
        };
    } catch (error) {
        return errorResponse(error, "downloadDocumentClient");
    }
};

export const viewDocumentClient = async (id: string): Promise<ActionsResponse<Blob | null>> => {
    try {
        const response = await clientAxios.get(`/documents/${id}/content`, {
            responseType: "blob",
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document visualisé avec succès",
            data: response.data as Blob,
        };
    } catch (error) {
        return errorResponse(error, "viewDocumentClient");
    }
};
