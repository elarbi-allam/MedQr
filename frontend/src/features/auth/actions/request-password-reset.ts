'use server';

import { ActionsResponse } from '@/lib/types/actions.type';
import { axiosWrapper } from '@/lib/wrappers/axios-wrapper';
import { errorResponse } from '@/lib/helpers/error-response';

export const requestPasswordReset = async (data: { email: string }): Promise<ActionsResponse<null>> => {
  try {
    const response = await axiosWrapper.post("/auth/forgot-password", data);

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: response.data.message,
      data: null,
    };
  } catch (error) {
    return errorResponse(error, "requestPasswordReset");
  }
};