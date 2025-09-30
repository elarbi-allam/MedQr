import { z } from 'zod';
import { ORDER_OPTIONS } from '@/lib/enums/order';
import { UserRole } from "@/lib/types/user.type";
import { UserStatus } from "@/lib/enums/user-status";

// Status options for admin users
export const ADMIN_USER_STATUS_OPTIONS = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVE']);

export type AdminUserParams = {
    order: z.infer<typeof ORDER_OPTIONS>;
    page: number;
    take: number;
    role?: UserRole;
    status?: UserStatus;
    search: string;
};

export type AdminUserDataType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: UserRole;
    status: UserStatus;
    enterprise?: {
        id: string;
        name: string;
        ice: string;
    };
};

export type CreateAdminUserDTO = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: UserRole;
    status: UserStatus;
    password: string;
};

export type UpdateAdminUserDTO = {
    id: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: UserRole;
    status?: UserStatus;
};
