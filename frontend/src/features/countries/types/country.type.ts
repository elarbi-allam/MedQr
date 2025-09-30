import { z } from "zod";
import { ORDER_OPTIONS } from "@/lib/enums/order";

// Country Status Enum
export enum CountryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type CountryParams = {
  order: z.infer<typeof ORDER_OPTIONS>;
  page: number;
  take: number;
  status?: CountryStatus;
  search?: string;
  name?: string;
};

export type CountryDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  en_name: string;
  ar_name: string;
  flag: string;
  isoA3: string;
  isoNum: number;
  dialCode: string;
  status: CountryStatus;
};

export type CreateCountryDTO = {
  name: string;
  en_name: string;
  ar_name: string;
  flag: string;
  isoA3: string;
  isoNum: number;
  dialCode: string;
  status: CountryStatus;
};

export type UpdateCountryDTO = {
  name?: string;
  en_name?: string;
  ar_name?: string;
  flag?: string;
  isoA3?: string;
  isoNum?: number;
  dialCode?: string;
  status?: CountryStatus;
};
