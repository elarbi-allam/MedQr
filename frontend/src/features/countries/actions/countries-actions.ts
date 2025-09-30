"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  CountryDataType,
  CountryParams,
  CreateCountryDTO,
  UpdateCountryDTO,
} from "../types/country.type";

// get all countries for admin
export default async function getAdminCountries(
  params: CountryParams
): Promise<ActionsResponse<CountryDataType[] | null>> {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get<{
      data: CountryDataType[];
      meta: MetaType;
    }>("/countries", {
      params,
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Pays récupérés avec succès",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    return errorResponse(error, "getAdminCountries");
  }
}

// get specific country
export const getAdminCountry = async (
  id: string
): Promise<ActionsResponse<CountryDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.get(`/countries/${id}`);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Pays récupéré avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getAdminCountry");
  }
};

// create country
export const createCountry = async (
  countryDTO: CreateCountryDTO
): Promise<ActionsResponse<CountryDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.post("/countries", countryDTO);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Pays créé avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "createCountry");
  }
};

// update country
export const updateAdminCountry = async ({
  id,
  countryData,
}: {
  id: string;
  countryData: UpdateCountryDTO;
}): Promise<ActionsResponse<CountryDataType | null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    const response = await axiosWrapper.patch(`/countries/${id}`, countryData);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Pays mis à jour avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "updateAdminCountry");
  }
};

// delete country
export const deleteCountry = async (
  id: string
): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession();
    if (!session) {
      toast.error("Vous n'êtes pas autorisé à effectuer cette action");
      return redirect("/unauthorized");
    }

    await axiosWrapper.delete(`/countries/${id}`);

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "Pays supprimé avec succès",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "deleteCountry");
  }
};

export interface CountriesResponse {
  data: CountryDataType[];
  meta: {
    page: number;
    take: number;
    total: number;
    lastPage: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
// get all active countries (public endpoint)
export const getAllActiveCountries = async (
  searchTerm?: string
): Promise<ActionsResponse<CountriesResponse | null>> => {
  try {
    const params: CountryParams = {
      page: 1,
      take: 10,
      order: "ASC",
    };

    // Ajouter le paramètre de recherche seulement si searchTerm est fourni et non vide
    if (searchTerm && searchTerm.trim()) {
      params.name = searchTerm.trim();
    }

    const response = await axiosWrapper.get("/countries/public", { params });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Pays actifs récupérés avec succès",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "getAllActiveCountries");
  }
};
