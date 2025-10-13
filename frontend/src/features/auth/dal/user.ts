"use server";

import { jwtDecode} from "jwt-decode";
import { getSession } from "./session";
import { UserRole } from "@/lib/types/user.type";
import { JWTPayloadType } from "@/lib/types/jwt-payload.type";

export const getCurrentUser = async (): Promise<UserRole | null> => {
  const token = await getSession();
  if (!token) return null;
  try {
    return jwtDecode<JWTPayloadType>(token).role;
  } catch (error) {
    console.error("Impossible de décoder le token:", error);
    return null;
  }
};

export const getUserRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();
  return user?? null;
};
