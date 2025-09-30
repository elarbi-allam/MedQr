import { z } from 'zod';

import { ORDER_OPTIONS } from '@/lib/enums/order';
import { ROLE_OPTIONS } from '@/lib/enums/roles';

// enums
export const STATUS_OPTIONS = z.enum(['active', 'inActive', 'archive']);

export type UserParams = {
    order: z.infer<typeof ORDER_OPTIONS>;
    page: number;
    take: number;
    role?: z.infer<typeof ROLE_OPTIONS>;
    status?: z.infer<typeof STATUS_OPTIONS>;
    search?: string;
};

export type UserDataType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    password: string;
};

export type CreateUserDTO = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
};

export type UpdateUserDTO = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    status?: string;
};

export type ChangePasswordDTO = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type AdminChangePasswordDTO = {
    id: string;
    requestId: string;
};

export type CurrentUserInfoType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
};

export type PasswordResetRequestType = {
    id: string;
    createdAt: string;
    status: number;
    expiredAt: string;
    user: Omit<UserDataType, 'createdAt' | 'updatedAt' | 'status'>;
};

export type PasswordResetDTO = {
    id: string;
    requestId: string;
};

export type PasswordResetResponseType = {
    message: string;
    email: string;
    newPassword: string;
};

export type PasswordResetRequestDTO = {
    email: string;
};
