"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  createMyEnterprise,
  getMyEnterprise,
  updateMyEnterprise,
} from "../actions/my-enterprise-actions";

// get my enterprise (for enterprise users)
export function useMyEnterprise() {
  return useQuery({
    queryKey: ["my-enterprise"],
    queryFn: () => getMyEnterprise(),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: AxiosError) => {
      // Don't retry if it's a 404 (no enterprise found)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// create my enterprise
export function useCreateMyEnterprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMyEnterprise,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        // Invalider les queries pour déclencher les redirections automatiques
        queryClient.invalidateQueries({
          queryKey: ["my-enterprise"],
        });
        // pour que useVerificationRedirect détecte le changement de phase
        queryClient.invalidateQueries({
          queryKey: ["verification-status"],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'entreprise");
    },
  });
}

// update my enterprise
export function useUpdateMyEnterprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyEnterprise,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["my-enterprise"],
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}
