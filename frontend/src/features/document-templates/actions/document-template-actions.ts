"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
    DocumentTemplateDataType,
    DocumentTemplateParams,
    CreateDocumentTemplateDTO,
    UpdateDocumentTemplateDTO,
} from "../types/document-template.type";

// Get all document templates (Admin only)
export default async function getDocumentTemplates(
    params: DocumentTemplateParams,
): Promise<ActionsResponse<DocumentTemplateDataType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<{
            data: DocumentTemplateDataType[];
            meta: MetaType;
        }>("/document-templates", {
            params,
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèles de documents récupérés avec succès",
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        return errorResponse(error, "getDocumentTemplates");
    }
}

// Get specific document template (Admin only)
export const getDocumentTemplate = async (id: string): Promise<ActionsResponse<DocumentTemplateDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get(`/document-templates/${id}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèle de document récupéré avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getDocumentTemplate");
    }
};

// Create document template (Admin only)
export const createDocumentTemplate = async (
    templateDTO: CreateDocumentTemplateDTO,
): Promise<ActionsResponse<DocumentTemplateDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post("/document-templates", templateDTO);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèle de document créé avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "createDocumentTemplate");
    }
};

// Update document template (Admin only)
export const updateDocumentTemplate = async ({
    id,
    templateData,
}: {
    id: string;
    templateData: Omit<UpdateDocumentTemplateDTO, "id">;
}): Promise<ActionsResponse<DocumentTemplateDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.patch(`/document-templates/${id}`, templateData);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèle de document mis à jour avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateDocumentTemplate");
    }
};

// Delete document template (Admin only)
export const deleteDocumentTemplate = async (id: string): Promise<ActionsResponse<null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        await axiosWrapper.delete(`/document-templates/${id}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Modèle de document supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "deleteDocumentTemplate");
    }
};

// Get required document templates for current user (Enterprise users)
export const getRequiredDocumentTemplates = async (): Promise<ActionsResponse<DocumentTemplateDataType[] | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get("/document-templates/required");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèles de documents requis récupérés avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getRequiredDocumentTemplates");
    }
};

// Get required truck document templates (Carrier only)
export const getRequiredTruckDocumentTemplates = async (): Promise<
    ActionsResponse<DocumentTemplateDataType[] | null>
> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get("/document-templates/required/truck");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèles de documents camions requis récupérés avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getRequiredTruckDocumentTemplates");
    }
};

// Get required truck document templates by truck ID (pour les carriers)
export const getRequiredTruckDocumentTemplatesById = async (
    truckId: string,
): Promise<ActionsResponse<unknown[] | null>> => {
    // TODO: the type should be changed to the correct type instead of unknown.
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get(`/document-templates/required/truck/${truckId}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Modèles de documents camion requis récupérés avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getRequiredTruckDocumentTemplatesById");
    }
};
