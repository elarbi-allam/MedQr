export enum UserRole {
  PATIENT = "ROLE_PATIENT",
  PROVIDER = "ROLE_PROVIDER",
  FACILITY = "ROLE_FACILITY",
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
