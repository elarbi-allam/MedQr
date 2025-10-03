'use server';

import { jwtDecode } from 'jwt-decode';
import { setSession } from '@/features/auth/dal/session';
import { ActionsResponse } from '@/lib/types/actions.type';
import { axiosWrapper, setAuthToken } from '@/lib/wrappers/axios-wrapper';
import { errorResponse } from '@/lib/helpers/error-response';
import { UserRole } from '@/lib/types/user.type';
import { JWTPayloadType } from '@/lib/types/jwt-payload.type';

const roleToDashboardPath: Record<string, string> = {
    [UserRole.PATIENT]: '/patient',
    [UserRole.PROVIDER]: '/provider',
    [UserRole.FACILITY]: '/facility',
};

export const login = async (data: {
    email: string;
    password: string;
}): Promise<ActionsResponse<{ redirectPath: string } | null>> => {
    try {
        const response = await axiosWrapper.post('/auth/authenticate', data);
        const token = response.data.token;

        if (!token) {
            return {
                status: 'ERROR',
                statusCode: 400,
                message: 'No access token found',
                data: null,
            };
        }

        await setSession(token);
        setAuthToken(token);

        const decodedToken = jwtDecode<JWTPayloadType>(token);
        const redirectPath = roleToDashboardPath[decodedToken.role] || '/';

        return {
            status: 'SUCCESS',
            statusCode: response.status,
            message: 'Login successful',
            data: { redirectPath },
        };
    } catch (error) {
        return errorResponse(error, 'login');
    }
};
