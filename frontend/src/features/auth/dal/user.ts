"use server";

import { jwtDecode } from "jwt-decode";
import { getSession } from "./session";
import { UserProfile, UserRole } from "@/lib/types/user.type";

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const token = await getSession();
  if (!token) return null;
  try {
    return jwtDecode<UserProfile>(token);
  } catch (error) {
    console.error("Impossible de décoder le token:", error);
    return null;
  }
};

export const getUserRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();
  return user?.role ?? null;
};
