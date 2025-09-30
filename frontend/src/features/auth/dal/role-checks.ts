"use server";

import { UserRole } from "@/lib/types/user.type";
import { getUserRole } from "./user";

export const checkUserRole = async (role: UserRole): Promise<boolean> => {
  const currentUserRole = await getUserRole();
  return currentUserRole === role;
};

export const isAdmin = async () => checkUserRole(UserRole.ADMIN);
export const isUser = async () => checkUserRole(UserRole.USER);
export const isEnterpriseUser = async () =>
  checkUserRole(UserRole.ENTERPRISE_USER);

export const hasNoValidRole = async (): Promise<boolean | null> => {
  const currentUserRole = await getUserRole();

  const validRoles = Object.values(UserRole);

  if (!currentUserRole || !validRoles.includes(currentUserRole)) {
    return false;
  }

  return true;
};
