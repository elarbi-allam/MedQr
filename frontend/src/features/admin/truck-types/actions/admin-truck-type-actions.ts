"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  TruckTypeDataType,
  TruckTypeParams,
  CreateTruckTypeDTO,
  UpdateTruckTypeDTO,
} from "../types/truck-type.type";

// get all truck types for admin
export default async function getAdminTruckTypes(
  params: TruckTypeParams
): Promise<ActionsResponse<TruckTypeDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: TruckTypeDataType[];
      meta: MetaType;
    }>("/truck-types", {
      params: {
        ...params,
        status: params.status,
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Types de camions récupérés avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getAdminTruckTypes");
  }
}

// get specific truck type
export const getAdminTruckType = async (
  id: string
): Promise<ActionsResponse<TruckTypeDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get(`/truck-types/${id}`);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Type de camion récupéré avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getAdminTruckType");
  }
};

// create truck type
export const createTruckType = async (
  truckTypeDTO: CreateTruckTypeDTO
): Promise<ActionsResponse<TruckTypeDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.post("/truck-types", truckTypeDTO);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Type de camion créé avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "createTruckType");
  }
};

// update truck type
export const updateAdminTruckType = async ({
  id,
  truckTypeData,
}: {
  id: string;
  truckTypeData: Omit<UpdateTruckTypeDTO, "id">;
}): Promise<ActionsResponse<TruckTypeDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.patch(
      `/truck-types/${id}`,
      truckTypeData
    );

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Type de camion mis à jour avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "updateAdminTruckType");
  }
};

// delete truck type
export const deleteTruckType = async (
  id: string
): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    await axiosWrapper.delete(`/truck-types/${id}`);

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "Type de camion supprimé avec succès",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "deleteTruckType");
  }
};

// get truck type options (accessible for all authenticated users)
export async function getTruckTypeOptions(
  params: TruckTypeParams = {}
): Promise<ActionsResponse<TruckTypeDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: TruckTypeDataType[];
      meta: MetaType;
    }>("/truck-types/options", {
      params: {
        order: params.order || "DESC",
        page: params.page || 1,
        take: params.take || 10,
        ...(params.search && { search: params.search }),
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Options des types de camions récupérées avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getTruckTypeOptions");
  }
}
