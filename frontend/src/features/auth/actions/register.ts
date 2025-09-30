"use server";
import { z } from "zod";

import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { registerSchema } from "../schemas/register-schema";
import { errorResponse } from "@/lib/helpers/error-response";

export const register = async (
  data: z.infer<typeof registerSchema>
): Promise<ActionsResponse<null>> => {
  try {
    const validatedData = registerSchema.parse(data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...apiData } = validatedData;
    const response = await axiosWrapper.post("/auth/register", apiData);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: response.data.message || "Inscription réussie",
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "register");
  }
};
