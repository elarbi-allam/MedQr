"use server";
import { jwtDecode } from "jwt-decode";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { AxiosError } from "axios";

type ValidationResponse = {
  isValid: boolean;
  message: string | null;
};
type ResetToken = {
  id: string;
  req: number;
  email: string;
  type: string;
  iat: number;
  exp: number;
};

export async function validateResetToken(
  token: string
): Promise<ValidationResponse> {
  try {
    const decodedToken = jwtDecode<ResetToken>(token);
    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
      return {
        isValid: false,
        message: "Le jeton a expiré.",
      };
    }

    const response = await axiosWrapper.post("/auth/validate-token", {
      token: token,
    });

    return {
      isValid: true,
      message: response.data.message,
    };
  } catch (error) {
    let errorMessage = "Le lien est invalide ou a expiré.";

    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      isValid: false,
      message: errorMessage,
    };
  }
}
