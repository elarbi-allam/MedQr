"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  CityDataType,
  CityParams,
  CreateCityDTO,
  UpdateCityDTO,
} from "../types/city.type";

// get all cities for admin
export default async function getAdminCities(
  params: CityParams
): Promise<ActionsResponse<CityDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: CityDataType[];
      meta: MetaType;
    }>("/cities", {
      params: {
        ...params,
        status: params.status,
        countryId: params.countryId,
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Villes récupérées avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getAdminCities");
  }
}

// get specific city
export const getAdminCity = async (
  id: string
): Promise<ActionsResponse<CityDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get(`/cities/${id}`);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Ville récupérée avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getAdminCity");
  }
};

// create city
export const createCity = async (
  cityDTO: CreateCityDTO
): Promise<ActionsResponse<CityDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.post("/cities", cityDTO);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Ville créée avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "createCity");
  }
};

// update city
export const updateAdminCity = async ({
  id,
  cityData,
}: {
  id: string;
  cityData: UpdateCityDTO;
}): Promise<ActionsResponse<CityDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.patch(`/cities/${id}`, cityData);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Ville mise à jour avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "updateAdminCity");
  }
};

// delete city
export const deleteCity = async (
  id: string
): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    await axiosWrapper.delete(`/cities/${id}`);

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "Ville supprimée avec succès",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "deleteCity");
  }
};

// get all countries for city form (simplified)


export interface CitiesResponse {
  data: CityDataType[];
  meta: {
    page: number;
    take: number;
    total: number;
    lastPage: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
// get all active cities (public endpoint)
export const getAllActiveCities = async (
  countryId?: string,
  searchTerm?: string
): Promise<ActionsResponse<CitiesResponse | null>> => {
  try {
    const params: Partial<CityParams> = {
      page: 1,
      take: 20,
      order: "ASC",
    };
    // Ajouter le filtre par pays si fourni
    if (countryId && countryId.trim()) {
      params.countryId = countryId.trim();
    }

    // Ajouter le paramètre de recherche seulement si searchTerm est fourni et non vide
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const response = await axiosWrapper.get("/cities/public", { params });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Villes actives récupérées avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getAllActiveCities");
  }
};
