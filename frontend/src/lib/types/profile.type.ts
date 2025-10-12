export enum UserType {
  PATIENT = "PATIENT",
  PROVIDER = "PROVIDER",
  FACILITY = "FACILITY",
}

export interface PatientProfile {
  patientId: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  userType: UserType.PATIENT;
}

export interface ProviderProfile {
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  phoneNumber?: string;
  licenseNumber: string;
  userType: UserType.PROVIDER;
}

export interface FacilityProfile {
  facilityId: string;
  email: string;
  name: string;
  type: string;
  address?: string;
  phoneNumber?: string;
  userType: UserType.FACILITY;
}

export type UserProfile = PatientProfile | ProviderProfile | FacilityProfile;