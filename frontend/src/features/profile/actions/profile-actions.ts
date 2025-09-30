"use server";
import { z } from "zod";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { UserProfile } from "@/lib/types/user.type";
import {
  updateProfileSchema,
  updateProfileImageSchema,
  changePasswordSchema,
} from "../schemas/profile-schemas";

export const getMyProfile = async (): Promise<ActionsResponse<UserProfile | null>> => {
  try {
    const response = await axiosWrapper.get("/users/me");
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Profile retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "get profile");
  }
};

export const updateProfileInfo = async (
  data: z.infer<typeof updateProfileSchema> | z.infer<typeof updateProfileImageSchema>
): Promise<ActionsResponse<UserProfile | null>> => {
  try {
    const response = await axiosWrapper.patch("/users/me", data);
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "update profile");
  }
};

export const changePassword = async (
  data: z.infer<typeof changePasswordSchema>
): Promise<ActionsResponse<null>> => {
  try {
    const response = await axiosWrapper.patch(
      "/users/me/change-password",
      data
    );
    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: response.data.message,
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "change password");
  }
};