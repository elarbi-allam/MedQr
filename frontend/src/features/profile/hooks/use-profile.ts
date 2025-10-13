"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyProfile,
  updatePatientProfile,
  updateProviderProfile,
  updateFacilityProfile,
  changePassword,
} from "../actions/profile-actions";
import { FacilityProfile, PatientProfile, ProviderProfile, UserType } from "@/lib/types/profile.type";
import { removeSession } from "@/features/auth/dal/session";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await getMyProfile();
      if (response.status === "ERROR") {
        throw new Error(response.message);
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await removeSession();
    },
    onSuccess: () => {
      // Supprimer toutes les données utilisateur du cache
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Déconnexion réussie");
    },
    onError: (error) => {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: async (data: PatientProfile | ProviderProfile | FacilityProfile) => {
      if (!currentUser) throw new Error("Utilisateur non connecté");

      // Déterminer quelle fonction appeler selon le type d'utilisateur
      switch (currentUser.userType) {
        case UserType.PATIENT:
          return updatePatientProfile(data);
        case UserType.PROVIDER:
          return updateProviderProfile(data);
        case UserType.FACILITY:
          return updateFacilityProfile(data);
        default:
          throw new Error("Type d'utilisateur non supporté");
      }
    },
    onSuccess: (data) => {
      if (data?.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Une erreur est survenue"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (data?.status === "SUCCESS") {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Une erreur est survenue"),
  });
}