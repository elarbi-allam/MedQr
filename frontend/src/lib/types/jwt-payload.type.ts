export type JWTPayloadType = {
    id: string;
    role: "admin" | "enterprise_user" | "user";
    iat: number;
    exp: number;
};
