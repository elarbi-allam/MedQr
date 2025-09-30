export enum UserRole {
  ADMIN = "admin",
  ENTERPRISE_USER = "enterprise_user",
  USER = "user",
}

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  phoneNumber: string;
  enterprise: {
    name: string;
    enterpriseType: string;
  }
  profile: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};
