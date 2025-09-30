"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import getAdminEnterprises, {
    deleteEnterprise,
    getAdminEnterprise,
    changeEnterpriseStatus,
} from "../actions/admin-enterprise-actions";
import { EnterpriseParams } from "../types/enterprise.type";

// get all admin enterprises
export function useAdminEnterprises(params: EnterpriseParams) {
    return useQuery({
        queryKey: ["admin-enterprises", params],
        queryFn: () => getAdminEnterprises(params),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
}

// get single admin enterprise
export function useAdminEnterprise(id: string) {
    return useQuery({
        queryKey: ["admin-enterprises", id],
        queryFn: () => getAdminEnterprise(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

// delete enterprise
export function useDeleteEnterprise() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEnterprise,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "admin-enterprises",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// change enterprise status
export function useChangeEnterpriseStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeEnterpriseStatus,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "admin-enterprises",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}