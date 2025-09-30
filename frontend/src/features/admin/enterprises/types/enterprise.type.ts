import { z } from "zod";
import { ORDER_OPTIONS } from "@/lib/enums/order";

// Enterprise Status Enum
export enum EnterpriseStatus {
  INCOMPLETE = "INCOMPLETE",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
}

// Enterprise Type Enum
export enum EnterpriseType {
  CARRIER = "CARRIER",
  SHIPPER = "SHIPPER",
}

export type EnterpriseParams = {
  order: z.infer<typeof ORDER_OPTIONS>;
  page: number;
  take: number;
  status?: EnterpriseStatus;
  enterpriseType?: EnterpriseType;
  search: string;
};

// Types simplifiés basés sur la réponse backend
export type CountryDataType = {
  id: string;
  name: string;
  en_name: string;
  ar_name: string;
  flag: string;
};

export type CityDataType = {
  id: string;
  name: string;
  en_name: string;
  ar_name?: string;
  country: CountryDataType;
};

export type ResponsibleUserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type VerifiedByUserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type EnterpriseDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  ice: string;
  rc: string;
  enterpriseType: EnterpriseType;
  logo?: string | null;
  status: EnterpriseStatus;
  verifiedAt?: string | null;
  city: CityDataType;
  responsible: ResponsibleUserType;
  verifiedBy?: VerifiedByUserType | null;
};

export type CreateEnterpriseDTO = {
  name: string;
  description: string;
  ice: string;
  rc: string;
  cityId: string;
  enterpriseType: EnterpriseType;
};

export type UpdateEnterpriseDTO = {
  name?: string;
  description?: string;
  ice?: string;
  rc?: string;
  cityId?: string;
  enterpriseType?: EnterpriseType;
};

export type ChangeEnterpriseStatusDTO = {
  status: EnterpriseStatus;
};
