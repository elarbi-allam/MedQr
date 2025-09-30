"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  TruckDataType,
  TruckParams,
  CreateTruckDTO,
  UpdateTruckDTO,
} from "../types/truck.type";

// Get all trucks (admin only)
export async function getAdminTrucks(
  params: TruckParams = {}
): Promise<ActionsResponse<TruckDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: TruckDataType[];
      meta: MetaType;
    }>("/trucks", {
      params: {
        order: params.order || "DESC",
        page: params.page || 1,
        take: params.take || 10,
        ...(params.search && { search: params.search }),
        ...(params.truckTypeId && { truckTypeId: params.truckTypeId }),
        ...(params.enterpriseId && { enterpriseId: params.enterpriseId }),
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Camions récupérés avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getAdminTrucks");
  }
}

// Get carrier's trucks
export async function getMyTrucks(
  params: TruckParams = {}
): Promise<ActionsResponse<TruckDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: TruckDataType[];
      meta: MetaType;
    }>("/trucks/my-trucks", {
      params: {
        order: params.order || "DESC",
        page: params.page || 1,
        take: params.take || 10,
        ...(params.search && { search: params.search }),
        ...(params.truckTypeId && { truckTypeId: params.truckTypeId }),
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Vos camions récupérés avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getMyTrucks");
  }
}

// Get specific truck by ID
export async function getTruck(
  id: string
): Promise<ActionsResponse<TruckDataType | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<TruckDataType>(`/trucks/${id}`);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Camion récupéré avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getTruck");
  }
}

// Create truck (carrier only)
export async function createTruck(
  truckDTO: CreateTruckDTO
): Promise<ActionsResponse<TruckDataType | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.post<TruckDataType>("/trucks", truckDTO);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Camion créé avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "createTruck");
  }
}

// Update truck (carrier only)
export async function updateTruck({
  id,
  truckData,
}: {
  id: string;
  truckData: UpdateTruckDTO;
}): Promise<ActionsResponse<TruckDataType | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.patch<TruckDataType>(
      `/trucks/${id}`,
      truckData
    );

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Camion mis à jour avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "updateTruck");
  }
}

// Delete truck (carrier only)
export async function deleteTruck(
  id: string
): Promise<ActionsResponse<null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    await axiosWrapper.delete(`/trucks/${id}`);

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "Camion supprimé avec succès",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "deleteTruck");
  }
}