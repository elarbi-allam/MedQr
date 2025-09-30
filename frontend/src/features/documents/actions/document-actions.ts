"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { DocumentDataType, DocumentParams, UpdateDocumentStatusDTO } from "../types/document.type";

// Get all documents (Admin only)
export default async function getDocuments(
    params: DocumentParams = { order: "DESC", page: 1, take: 10 },
): Promise<ActionsResponse<DocumentDataType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<{
            data: DocumentDataType[];
            meta: MetaType;
        }>("/documents", {
            params,
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Documents récupérés avec succès",
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        return errorResponse(error, "getDocuments");
    }
}

// Get specific document (Admin only)
export const getDocument = async (id: string): Promise<ActionsResponse<DocumentDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<DocumentDataType>(`/documents/${id}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document récupéré avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getDocument");
    }
};

// Get my documents (Enterprise users)
export const getMyDocuments = async (): Promise<ActionsResponse<DocumentDataType[] | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<DocumentDataType[]>("/documents/my-documents");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Mes documents récupérés avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getMyDocuments");
    }
};

export const updateDocumentStatus = async ({
    id,
    statusData,
}: {
    id: string;
    statusData: UpdateDocumentStatusDTO;
}): Promise<ActionsResponse<DocumentDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.patch<DocumentDataType>(`/documents/${id}/status`, statusData);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Statut du document mis à jour avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateDocumentStatus");
    }
};

// Upload enterprise document (Enterprise users)
export const uploadEnterpriseDocument = async (
    formData: FormData,
): Promise<ActionsResponse<DocumentDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<DocumentDataType>("/documents/upload/enterprise", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document téléchargé avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "uploadEnterpriseDocument");
    }
};

// Upload truck document (Carrier users)
export const uploadTruckDocument = async (formData: FormData): Promise<ActionsResponse<DocumentDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<DocumentDataType>("/documents/upload/truck", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Document camion téléchargé avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "uploadTruckDocument");
    }
};
