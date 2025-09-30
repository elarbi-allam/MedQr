"use server";
import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { errorResponse } from "@/lib/helpers/error-response";

export const resetPassword = async (data: {
  password: string;
  confirmPassword: string;
  token: string;
}): Promise<ActionsResponse<null>> => {
  try {
    const url = `/auth/reset-password?token=${data.token}`;

    const response = await axiosWrapper.post(url, {
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: response.data.message,
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "resetPassword");
  }
};
