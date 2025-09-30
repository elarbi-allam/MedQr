"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getAdminTrucks,
  getMyTrucks,
  getTruck,
  createTruck,
  updateTruck,
  deleteTruck,
} from "../actions/truck-actions";
import { TruckParams } from "../types/truck.type";

// get all admin trucks
export function useAdminTrucks(params: TruckParams) {
  return useQuery({
    queryKey: ["admin-trucks", params],
    queryFn: () => getAdminTrucks(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// get carrier's trucks
export function useMyTrucks(params: TruckParams) {
  return useQuery({
    queryKey: ["my-trucks", params],
    queryFn: () => getMyTrucks(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// get single truck
export function useTruck(id: string) {
  return useQuery({
    queryKey: ["trucks", id],
    queryFn: () => getTruck(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// create truck
export function useCreateTruck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTruck,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0] === "my-trucks" || query.queryKey[0] === "admin-trucks",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// update truck
export function useUpdateTruck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTruck,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0] === "my-trucks" || 
            query.queryKey[0] === "admin-trucks" || 
            query.queryKey[0] === "trucks",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// delete truck
export function useDeleteTruck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTruck,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => 
            query.queryKey[0] === "my-trucks" || query.queryKey[0] === "admin-trucks",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}