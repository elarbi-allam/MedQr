'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

import { JWTPayloadType } from '@/lib/types/jwt-payload.type';

export const isNormalUser = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token');
    if (!accessToken) return false;
    const decodedToken = jwtDecode<JWTPayloadType>(accessToken.value);
    if (!decodedToken.role) return false;
    return decodedToken.role === 'user';
};
