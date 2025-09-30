"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import getUsers, {
    adminChangeUserPassword,
    changePassword,
    createUser,
    deleteUser,
    getCurrentUserInfo,
    getPasswordResetRequest,
    passwordResetRequest,
    updateUser,
} from "../actions/user";
import { UserParams } from "../types/user.type";

// get all users
export function useUsers(params: UserParams) {
    // console.log("params =>", params);
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getUsers(params),
        // enabled: !!params.page && !!params.take,
        placeholderData: keepPreviousData,
        staleTime: 0, // no stale time
    });
}

// create user
export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// delete user
export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// update user
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// update user status
export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "users",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// user change password
export function useChangePassword() {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });
}

// admin change user password
export function useAdminChangeUserPassword() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminChangeUserPassword,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["passwordResetRequest"] });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// get password reset request
export function useGetPasswordResetRequest() {
    return useQuery({
        queryKey: ["passwordResetRequest"],
        queryFn: getPasswordResetRequest,
        staleTime: 0, // no stale time
    });
}

// get current user info
export function useGetCurrentUserInfo() {
    return useQuery({
        queryKey: ["currentUserInfo"],
        queryFn: getCurrentUserInfo,
        staleTime: 0, // no stale time
    });
}

// password reset request
export function usePasswordResetRequest() {
    return useMutation({
        mutationFn: passwordResetRequest,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });
}
