"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import {
    ChangePasswordDTO,
    CreateUserDTO,
    CurrentUserInfoType,
    PasswordResetRequestDTO,
    PasswordResetRequestType,
    PasswordResetResponseType,
    UpdateUserDTO,
    UserDataType,
    UserParams,
} from "../types/user.type";
import { toast } from "sonner";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";

// get all users
export default async function getUsers(
    params: UserParams
): Promise<ActionsResponse<UserDataType[] | null>> {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<{
            data: UserDataType[];
            meta: MetaType;
        }>("/users", {
            params: {
                ...params,
                status: params.status,
            },
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Les utilisateurs récupérés avec succès",
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        return errorResponse(error, "getUsers");
    }
}

// create user
export const createUser = async (
    userDTO: CreateUserDTO
): Promise<ActionsResponse<UserDataType | null>> => {
    try {
        // check if user is authenticated
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
        return errorResponse(error, "createUser");
    }
};

// get current user data
export const getCurrentUser = async (): Promise<
    ActionsResponse<UserDataType | null>
> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get("/users/me");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Données de l'utilisateur récupérées avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getCurrentUser");
    }
};

// get specific user data
export const getUser = async (
    id: string
): Promise<ActionsResponse<UserDataType | null>> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get(`/users/${id}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Données de l'utilisateur récupérées avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getUser");
    }
};

// update specific user data
export const updateUser = async ({
    id,
    userData,
}: {
    id: string;
    userData: Omit<UpdateUserDTO, "id">;
}): Promise<ActionsResponse<UserDataType | null>> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.patch(`/users/${id}`, userData);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Données de l'utilisateur mises à jour avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateUser");
    }
};

// delete user
export const deleteUser = async (
    id: string
): Promise<ActionsResponse<UserDataType | null>> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.delete(`/users/${id}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Utilisateur supprimé avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "deleteUser");
    }
};

// user change password
export const changePassword = async (
    passwordData: ChangePasswordDTO
): Promise<ActionsResponse<unknown | null>> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post(
            "/users/me/change-password",
            passwordData
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Mot de passe modifié avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "changePassword");
    }
};

// admin change user password
export const adminChangeUserPassword = async ({
    id,
    requestId,
}: {
    id: string;
    requestId: string;
}): Promise<ActionsResponse<PasswordResetResponseType | null>> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post(
            `/users/change-password/${id}?requestId=${requestId}`
        );

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

// get password reset request
export const getPasswordResetRequest = async (): Promise<
    ActionsResponse<PasswordResetRequestType[] | null>
> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get(
            "/password-reset-request/notification"
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message:
                "Demande de réinitialisation de mot de passe récupérée avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getPasswordResetRequest");
    }
};

// get current user info
export const getCurrentUserInfo = async (): Promise<
    ActionsResponse<CurrentUserInfoType | null>
> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get("/users/me");

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Données de l'utilisateur récupérées avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getCurrentUserInfo");
    }
};

// password reset request
export const passwordResetRequest = async (
    passwordResetRequestDTO: PasswordResetRequestDTO
): Promise<ActionsResponse<null>> => {
    try {
        // check if user is authenticated
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post(
            "/password-reset-request",
            passwordResetRequestDTO
        );

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message:
                "Demande de réinitialisation de mot de passe envoyée avec succès",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "passwordResetRequest");
    }
};
