"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import getDocumentTemplates, {
  createDocumentTemplate,
  deleteDocumentTemplate,
  getDocumentTemplate,
  updateDocumentTemplate,
  getRequiredDocumentTemplates,
  getRequiredTruckDocumentTemplates,
  getRequiredTruckDocumentTemplatesById,
} from "../actions/document-template-actions";
import { DocumentTemplateParams } from "../types/document-template.type";

// Get all document templates (Admin)
export function useDocumentTemplates(params: DocumentTemplateParams) {
  return useQuery({
    queryKey: ["document-templates", params],
    queryFn: () => getDocumentTemplates(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
}

// Get single document template (Admin)
export function useDocumentTemplate(id: string) {
  return useQuery({
    queryKey: ["document-templates", id],
    queryFn: () => getDocumentTemplate(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// Create document template (Admin)
export function useCreateDocumentTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDocumentTemplate,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "document-templates",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// Update document template (Admin)
export function useUpdateDocumentTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocumentTemplate,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "document-templates",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// Delete document template (Admin)
export function useDeleteDocumentTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocumentTemplate,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success(data.message);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "document-templates",
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// Get required document templates (Enterprise users)
export function useRequiredDocumentTemplates() {
  return useQuery({
    queryKey: ["required-document-templates"],
    queryFn: () => getRequiredDocumentTemplates(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get required truck document templates (Carrier)
export function useRequiredTruckDocumentTemplates() {
  return useQuery({
    queryKey: ["required-truck-document-templates"],
    queryFn: () => getRequiredTruckDocumentTemplates(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get required truck document templates by truck ID (Carriers)
export function useRequiredTruckDocumentTemplatesById(truckId: string) {
  return useQuery({
    queryKey: ["required-truck-document-templates", truckId],
    queryFn: () => getRequiredTruckDocumentTemplatesById(truckId),
    enabled: !!truckId,
    staleTime: 1000 * 60 * 5,
  });
}
