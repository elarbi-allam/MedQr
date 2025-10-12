"use server";
import { z } from "zod";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { UserProfile, UserType } from "@/lib/types/profile.type";
import {
  updatePatientProfileSchema,
  updateProviderProfileSchema,
  updateFacilityProfileSchema,
  changePasswordSchema,
} from "../schemas/profile-schemas";

/**
 * Récupère le profil de l'utilisateur connecté
 * Détecte automatiquement le type d'utilisateur
 */
export const getMyProfile = async (): Promise<
  ActionsResponse<UserProfile | null>
> => {
  try {
    // Essayer d'abord en tant que Patient
    try {
      const response = await axiosWrapper.get("/profile/patient");
      return {
        status: "SUCCESS",
        statusCode: response.status,
        message: "Profile récupéré avec succès",
        data: { ...response.data, userType: UserType.PATIENT },
      };
    } catch (patientError) {
      // Essayer en tant que Provider
      try {
        const response = await axiosWrapper.get("/profile/provider");
        return {
          status: "SUCCESS",
          statusCode: response.status,
          message: "Profile récupéré avec succès",
          data: { ...response.data, userType: UserType.PROVIDER },
        };
      } catch (providerError) {
        // Essayer en tant que Facility
        const response = await axiosWrapper.get("/profile/facility");
        return {
          status: "SUCCESS",
          statusCode: response.status,
          message: "Profile récupéré avec succès",
          data: { ...response.data, userType: UserType.FACILITY },
        };
      }
    }
  } catch (error) {
    return errorResponse(error, "récupération du profil");
  }
};

/**
 * Met à jour le profil Patient
 */
export const updatePatientProfile = async (
  data: z.infer<typeof updatePatientProfileSchema>
): Promise<ActionsResponse<UserProfile | null>> => {
  try {
    const response = await axiosWrapper.put("/profile/patient", data);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Profil mis à jour avec succès",
      data: { ...response.data, userType: UserType.PATIENT },
    };
  } catch (error) {
    return errorResponse(error, "mise à jour du profil");
  }
};

/**
 * Met à jour le profil Provider
 */
export const updateProviderProfile = async (
  data: z.infer<typeof updateProviderProfileSchema>
): Promise<ActionsResponse<UserProfile | null>> => {
  try {
    const response = await axiosWrapper.put("/profile/provider", data);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Profil mis à jour avec succès",
      data: { ...response.data, userType: UserType.PROVIDER },
    };
  } catch (error) {
    return errorResponse(error, "mise à jour du profil");
  }
};

/**
 * Met à jour le profil Facility
 */
export const updateFacilityProfile = async (
  data: z.infer<typeof updateFacilityProfileSchema>
): Promise<ActionsResponse<UserProfile | null>> => {
  try {
    const response = await axiosWrapper.put("/profile/facility", data);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Profil mis à jour avec succès",
      data: { ...response.data, userType: UserType.FACILITY },
    };
  } catch (error) {
    return errorResponse(error, "mise à jour du profil");
  }
};

/**
 * Change le mot de passe (commun à tous les types)
 */
export const changePassword = async (
  data: z.infer<typeof changePasswordSchema>
): Promise<ActionsResponse<null>> => {
  try {
    const response = await axiosWrapper.post("/profile/change-password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Mot de passe modifié avec succès",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "changement de mot de passe");
  }
};