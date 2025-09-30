"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import getAdminUsers, {
    createAdminUser,
    deleteAdminUser,
    getAdminUser,
    updateAdminUser,
    adminChangeUserPassword,
} from "../actions/admin-user-actions";
import { AdminUserParams } from "../types/admin-user.type";

// get all admin users
export function useAdminUsers(params: AdminUserParams) {
    return useQuery({
        queryKey: ["admin-users", params],
        queryFn: () => getAdminUsers(params),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
}

// get single admin user
export function useAdminUser(id: string) {
    return useQuery({
        queryKey: ["admin-users", id],
        queryFn: () => getAdminUser(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

// create admin user
export function useCreateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAdminUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "admin-users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// update admin user
export function useUpdateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAdminUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "admin-users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// delete admin user
export function useDeleteAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "admin-users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// admin change user password
export function useAdminChangeUserPassword() {
    return useMutation({
        mutationFn: adminChangeUserPassword,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });
}