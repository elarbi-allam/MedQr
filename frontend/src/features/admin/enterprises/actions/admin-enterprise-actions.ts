"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  EnterpriseDataType,
  EnterpriseParams,
  ChangeEnterpriseStatusDTO,
} from "../types/enterprise.type";

// get all enterprises for admin
export default async function getAdminEnterprises(
  params: EnterpriseParams
): Promise<ActionsResponse<EnterpriseDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: EnterpriseDataType[];
      meta: MetaType;
    }>("/enterprises", {
      params: {
        ...params,
        status: params.status,
        enterpriseType: params.enterpriseType,
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Entreprises récupérées avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getAdminEnterprises");
  }
}

// get specific enterprise
export const getAdminEnterprise = async (
  id: string
): Promise<ActionsResponse<EnterpriseDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get(`/enterprises/${id}`);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Entreprise récupérée avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getAdminEnterprise");
  }
};

// delete enterprise (admin only)
export const deleteEnterprise = async (
  id: string
): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    await axiosWrapper.delete(`/enterprises/${id}`);

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "Entreprise supprimée avec succès",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "deleteEnterprise");
  }
};

// change enterprise status (admin only)
export const changeEnterpriseStatus = async ({
  id,
  status,
}: {
  id: string;
  status: ChangeEnterpriseStatusDTO;
}): Promise<ActionsResponse<EnterpriseDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.patch(
      `/enterprises/${id}/status`,
      status
    );

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Statut de l'entreprise modifié avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "changeEnterpriseStatus");
  }
};
