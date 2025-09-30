"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  EnterpriseDataType,
  CreateEnterpriseDTO,
  UpdateEnterpriseDTO,
} from "@/features/admin/enterprises/types/enterprise.type";

// get my enterprise (for enterprise users)
export const getMyEnterprise = async (): Promise<
  ActionsResponse<EnterpriseDataType | null>
> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get("/enterprises/my-enterprise");

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Votre entreprise récupérée avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getMyEnterprise");
  }
};

// create enterprise (for enterprise users)
export const createMyEnterprise = async (
  enterpriseDTO: CreateEnterpriseDTO
): Promise<ActionsResponse<EnterpriseDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.post("/enterprises", enterpriseDTO);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Entreprise créée avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "createMyEnterprise");
  }
};

// update my enterprise (for enterprise users)
export const updateMyEnterprise = async (
  enterpriseData: UpdateEnterpriseDTO
): Promise<ActionsResponse<EnterpriseDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.patch(
      "/enterprises/my-enterprise",
      enterpriseData
    );

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Votre entreprise mise à jour avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "updateMyEnterprise");
  }
};
