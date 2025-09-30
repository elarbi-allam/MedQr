import { z } from 'zod';
import { ORDER_OPTIONS } from '@/lib/enums/order';

// Truck Type Status Enum
export enum TruckTypeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ARCHIVE = 'archive',
}

export type TruckTypeParams = {
    order?: z.infer<typeof ORDER_OPTIONS>;
    page?: number;
    take?: number;
    status?: TruckTypeStatus;
    search?: string;
};

export type TruckTypeDataType = {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    description: string;
    slug: string;
    icon?: string;
    status?: TruckTypeStatus;
};

export type CreateTruckTypeDTO = {
    name: string;
    description: string;
    slug: string;
    icon?: string;
    status: TruckTypeStatus;
};

export type UpdateTruckTypeDTO = {
    name?: string;
    description?: string;
    slug?: string;
    icon?: string;
    status?: TruckTypeStatus;
};