"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import getAdminTruckTypes, {
  createTruckType,
  deleteTruckType,
  getAdminTruckType,
  updateAdminTruckType,
} from "../actions/admin-truck-type-actions";
import { TruckTypeParams } from "../types/truck-type.type";
import { getTruckTypeOptions } from "../actions/admin-truck-type-actions";

// get all admin truck types
export function useAdminTruckTypes(params: TruckTypeParams) {
  return useQuery({
    queryKey: ["admin-truck-types", params],
    queryFn: () => getAdminTruckTypes(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// get single admin truck type
export function useAdminTruckType(id: string) {
  return useQuery({
    queryKey: ["admin-truck-types", id],
    queryFn: () => getAdminTruckType(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// create truck type
export function useCreateTruckType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTruckType,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0] === "admin-truck-types" || 
            query.queryKey[0] === "truck-type-options",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// update admin truck type
export function useUpdateAdminTruckType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminTruckType,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0] === "admin-truck-types" || 
            query.queryKey[0] === "truck-type-options",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// delete truck type
export function useDeleteTruckType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTruckType,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0] === "admin-truck-types" || 
            query.queryKey[0] === "truck-type-options",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// get truck type options (accessible for all authenticated users)
export function useTruckTypeOptions(params: TruckTypeParams = {}) {
  return useQuery({
    queryKey: ["truck-type-options", params],
    queryFn: () => getTruckTypeOptions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}