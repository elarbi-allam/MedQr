import { z } from "zod";
import { ORDER_OPTIONS } from "@/lib/enums/order";

// City Status Enum
export enum CityStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type CityParams = {
  order: z.infer<typeof ORDER_OPTIONS>;
  page: number;
  take: number;
  status?: CityStatus;
  countryId?: string;
  search?: string;
};

export type CityDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  en_name: string;
  ar_name: string;
  status: CityStatus;
  country: {
    id: string;
    name: string;
    en_name: string;
    ar_name: string;
    flag: string;
    isoA3: string;
  };
};

export type CreateCityDTO = {
  name: string;
  en_name: string;
  ar_name: string;
  countryId: string;
  status: CityStatus;
};

export type UpdateCityDTO = {
  name?: string;
  en_name?: string;
  ar_name?: string;
  countryId?: string;
  status?: CityStatus;
};
