import { UserRole } from "./user.type";

export type JWTPayloadType = {
    sub: string;
    role: UserRole;
    iat: number;
    exp: number;
};
