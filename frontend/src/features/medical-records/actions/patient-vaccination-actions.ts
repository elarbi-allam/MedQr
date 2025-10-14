"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { PaginatedResponse } from "../types/medical-record.types";
import { VaccinationType } from "../types/medication-vaccination.types";
// Get my vaccinations (patient view)
export async function getMyVaccinations(
    page: number = 0,
    size: number = 10,
): Promise<ActionsResponse<PaginatedResponse<VaccinationType> | null>> {
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

        const response = await axiosWrapper.get<PaginatedResponse<VaccinationType>>(
            `/vaccinations/my?${params.toString()}`,
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Vaccinations récupérées",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getMyVaccinations");
    }
}
