"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import getAdminCities, {
  getAllActiveCities,
  createCity,
  deleteCity,
  getAdminCity,
  updateAdminCity,
} from "../actions/cities-actions";
import { CityParams } from "../types/city.type";

// get all admin cities
export function useAdminCities(params: CityParams) {
  return useQuery({
    queryKey: ["admin-cities", params],
    queryFn: () => getAdminCities(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// get single admin city
export function useAdminCity(id: string) {
  return useQuery({
    queryKey: ["admin-cities", id],
    queryFn: () => getAdminCity(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// create city
export function useCreateCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCity,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "admin-cities",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// update admin city
export function useUpdateAdminCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCity,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "admin-cities",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// delete city
export function useDeleteCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCity,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "admin-cities",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useActiveCities(countryId?: string, searchTerm?: string) {
  const trimmedCountryId = countryId?.trim();
  const trimmedSearchTerm = searchTerm?.trim();

  return useQuery({
    queryKey: ["active-cities", trimmedCountryId, trimmedSearchTerm],
    queryFn: () => getAllActiveCities(trimmedCountryId, trimmedSearchTerm),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    // Désactive la requête si aucun countryId n'est fourni
    enabled: Boolean(trimmedCountryId),
    // Garde les données précédentes pendant le rechargement
    placeholderData: (previousData) => previousData,
  });
}
