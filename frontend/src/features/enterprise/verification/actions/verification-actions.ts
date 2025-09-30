"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { getMyEnterprise } from "../../my-enterprise/actions/my-enterprise-actions";
import { getRequiredDocumentTemplates } from "@/features/document-templates/actions/document-template-actions";
import { VerificationStatus, VerificationPhase } from "../types/verification.type";
import { EnterpriseStatus } from "@/features/admin/enterprises/types/enterprise.type";

export const getVerificationStatus = async (): Promise<ActionsResponse<VerificationStatus | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            return redirect("/unauthorized");
        }

        // Récupérer l'entreprise
        const enterpriseResponse = await getMyEnterprise();
        const hasEnterprise = enterpriseResponse.status === "SUCCESS" && !!enterpriseResponse.data;

        // Si pas d'entreprise, phase de création
        if (!hasEnterprise) {
            return {
                status: "SUCCESS",
                statusCode: 200,
                message: "Statut de vérification récupéré",
                data: {
                    phase: VerificationPhase.ENTERPRISE_CREATION,
                    hasEnterprise: false,
                    documentsUploaded: false,
                    canAccessDashboard: false,
                },
            };
        }

        const enterprise = enterpriseResponse.data!;
        const enterpriseStatus = enterprise.status;

        // Si entreprise active, accès complet
        if (enterpriseStatus === EnterpriseStatus.ACTIVE) {
            return {
                status: "SUCCESS",
                statusCode: 200,
                message: "Statut de vérification récupéré",
                data: {
                    phase: VerificationPhase.VERIFIED,
                    hasEnterprise: true,
                    enterpriseStatus,
                    documentsUploaded: true,
                    canAccessDashboard: true,
                },
            };
        }

        // Si en attente de vérification, phase d'attente
        if (enterpriseStatus === EnterpriseStatus.PENDING_VERIFICATION) {
            return {
                status: "SUCCESS",
                statusCode: 200,
                message: "Statut de vérification récupéré",
                data: {
                    phase: VerificationPhase.VERIFICATION_PENDING,
                    hasEnterprise: true,
                    enterpriseStatus,
                    documentsUploaded: true,
                    canAccessDashboard: false,
                },
            };
        }

        // Vérifier les documents
        const documentsResponse = await getRequiredDocumentTemplates();
        const templates = documentsResponse.data || [];

        // Vérifier si tous les documents sont uploadés
        const documentsUploaded =
            templates.length > 0 && templates.every((template) => template.documents && template.documents.length > 0);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Statut de vérification récupéré",
            data: {
                phase: VerificationPhase.DOCUMENT_UPLOAD,
                hasEnterprise: true,
                enterpriseStatus,
                documentsUploaded,
                canAccessDashboard: false,
            },
        };
    } catch (error) {
        return errorResponse(error, "getVerificationStatus");
    }
};

export const submitForVerification = async (): Promise<ActionsResponse<boolean | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            return redirect("/unauthorized");
        }

        await axiosWrapper.patch("/enterprises/my-enterprise/submit-for-verification");

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Dossier soumis pour vérification",
            data: true,
        };
    } catch (error) {
        return errorResponse(error, "submitForVerification");
    }
};

export const isEnterpriseVerified = async (): Promise<boolean | undefined> => {
    try {
        const verificationStatus = await getVerificationStatus();
        return verificationStatus.status === "SUCCESS" && verificationStatus.data?.canAccessDashboard;
    } catch {
        return false;
    }
};
