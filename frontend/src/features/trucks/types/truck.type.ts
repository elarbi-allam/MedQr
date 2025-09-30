import { z } from 'zod';
import { ORDER_OPTIONS } from '@/lib/enums/order';

// Truck data type based on API response
export type TruckDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  registrationNumber: string;
  maxWeight: string;
  enterprise?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    ice: string;
    rc: string;
    enterpriseType: string;
    logo: string | null;
    status: string;
    verifiedAt: string;
  };
  truckType: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    status: string;
  };
};

// Truck params for API requests
export type TruckParams = {
  order?: z.infer<typeof ORDER_OPTIONS>;
  page?: number;
  take?: number;
  search?: string;
  truckTypeId?: string;
  enterpriseId?: string;
};

// Create truck DTO
export type CreateTruckDTO = {
  registrationNumber: string;
  maxWeight: number;
  truckTypeId: string;
};

// Update truck DTO
export type UpdateTruckDTO = {
  registrationNumber?: string;
  maxWeight?: number;
  truckTypeId?: string;
};