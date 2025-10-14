"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { PaginatedResponse } from "../types/medical-record.types";
import { MedicationType } from "../types/medication-vaccination.types";

// Get my medications (patient view)
export async function getMyMedications(
    currentOnly: boolean = false,
    page: number = 0,
    size: number = 10
): Promise<ActionsResponse<PaginatedResponse<MedicationType> | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Non autorisé");
            return redirect("/unauthorized");
        }

        const params = new URLSearchParams({
            currentOnly: currentOnly.toString(),
            page: page.toString(),
            size: size.toString(),
        });

        const response = await axiosWrapper.get<PaginatedResponse<MedicationType>>(
            `/medications/my?${params.toString()}`
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Médicaments récupérés",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getMyMedications");
    }
}