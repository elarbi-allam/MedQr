"use server";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { errorResponse } from "@/lib/helpers/error-response";
import { MediaUploadResponse } from "../types/media.type";

export const uploadMedia = async (
  formData: FormData
): Promise<MediaUploadResponse> => {
  try {
    const response = await axiosWrapper.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: "Media uploaded successfully",
      data: response.data,
    };
  } catch (error) {
    return errorResponse(error, "upload media");
  }
};
