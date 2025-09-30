"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
    AdminUserDataType,
    AdminUserParams,
    CreateAdminUserDTO,
    UpdateAdminUserDTO,
} from "../types/admin-user.type";

// get all users for admin
export default async function getAdminUsers(
    params: AdminUserParams
): Promise<ActionsResponse<AdminUserDataType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<{
            data: AdminUserDataType[];
            meta: MetaType;
        }>("/users", {
            params: {
                ...params,
            },
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Utilisateurs récupérés avec succès",
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        return errorResponse(error, "getAdminUsers");
    }
}

// get specific user
export const getAdminUser = async (
    id: string
): Promise<ActionsResponse<AdminUserDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get(`/users/${id}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Utilisateur récupéré avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getAdminUser");
    }
};

// create user
export const createAdminUser = async (
    userDTO: CreateAdminUserDTO
): Promise<ActionsResponse<AdminUserDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post("/users", userDTO);
        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Utilisateur créé avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "createAdminUser");
    }
};

// update user
export const updateAdminUser = async ({
    id,
    userData,
}: {
    id: string;
    userData: Omit<UpdateAdminUserDTO, "id">;
}): Promise<ActionsResponse<AdminUserDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.patch(`/users/${id}`, userData);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Utilisateur mis à jour avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateAdminUser");
    }
};

// delete user
export const deleteAdminUser = async (
    id: string
): Promise<ActionsResponse<null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        await axiosWrapper.delete(`/users/${id}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Utilisateur supprimé avec succès",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "deleteAdminUser");
    }
};

// admin change user password
export const adminChangeUserPassword = async (
    id: string
): Promise<ActionsResponse<{ newPassword: string; message: string; email: string } | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post(`/users/change-password/${id}`, {});

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Mot de passe modifié avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "adminChangeUserPassword");
    }
};