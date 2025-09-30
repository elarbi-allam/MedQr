"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  Query,
} from "@tanstack/react-query";
import { CountryStatus } from "@/features/countries/types/country.type";
import { toast } from "sonner";

import getAdminCountries, {
  getAllActiveCountries,
  createCountry,
  deleteCountry,
  getAdminCountry,
  updateAdminCountry,
} from "../actions/countries-actions";
import { CountryParams } from "../types/country.type";

// Fonction utilitaire pour invalider tous les caches liés aux countries
const invalidateCountriesQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({
    predicate: (query: Query) =>
      query.queryKey[0] === "admin-countries" ||
      query.queryKey[0] === "countries-for-cities",
  });
};

// get all admin countries
export function useAdminCountries(params: CountryParams) {
  return useQuery({
    queryKey: ["admin-countries", params],
    queryFn: () => getAdminCountries(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// get single admin country
export function useAdminCountry(id: string) {
  return useQuery({
    queryKey: ["admin-countries", id],
    queryFn: () => getAdminCountry(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// create country
export function useCreateCountry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCountry,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "admin-countries",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// update admin country
export function useUpdateAdminCountry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCountry,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        invalidateCountriesQueries(queryClient);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// delete country
export function useDeleteCountry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "admin-countries",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// get all countries for cities
export function useCountriesForCities() {
  return useQuery({
    queryKey: ["countries-for-cities"],
    queryFn: () =>
      getAdminCountries({
        take: 50,
        status: CountryStatus.ACTIVE,
        page: 1,
        order: "ASC",
      }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useActiveCountries(searchTerm?: string) {
  const trimmedSearchTerm = searchTerm?.trim();

  return useQuery({
    queryKey: ["active-countries", trimmedSearchTerm],
    queryFn: () => getAllActiveCountries(trimmedSearchTerm),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: true,
    refetchOnWindowFocus: false,
    // Garde les données précédentes pendant le rechargement pour une UX plus fluide
    placeholderData: (previousData) => previousData,
  });
}
