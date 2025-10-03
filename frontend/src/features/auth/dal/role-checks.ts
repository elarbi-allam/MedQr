"use server";

import { UserRole } from "@/lib/types/user.type";
import { getUserRole } from "./user";

export const checkUserRole = async (role: UserRole): Promise<boolean> => {
  const currentUserRole = await getUserRole();
  return currentUserRole === role;
};

export const isPatient = async () => checkUserRole(UserRole.PATIENT);
export const isProvider = async () => checkUserRole(UserRole.PROVIDER);
export const isFacility = async () =>
  checkUserRole(UserRole.FACILITY);

export const hasNoValidRole = async (): Promise<boolean | null> => {
  const currentUserRole = await getUserRole();

  const validRoles = Object.values(UserRole);

  if (!currentUserRole || !validRoles.includes(currentUserRole)) {
    return false;
  }

  return true;
};
