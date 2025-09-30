"use server";

import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

// get session token
export const getSession = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token");
    if (
        !accessToken ||
        !accessToken.value ||
        typeof accessToken.value !== "string" ||
        accessToken.value.split(".").length !== 3
    ) {
        return null;
    }
    // check token is expired
    if (accessToken) {
        const decodedToken = jwtDecode<JwtPayload>(accessToken.value);
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
            return null;
        }
    }

    return accessToken?.value;
};

// set session token
export const setSession = async (token: string) => {
    const cookieStore = await cookies();
    const decodedToken = jwtDecode<JwtPayload>(token);

    // Set cookie expiration to match token expiration or 1 hour
    const expiresIn = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 60 * 60 * 1000);

    // In production, cookies need specific settings to work across domains and be accessible to JavaScript
    cookieStore.set("access-token", token, {
        expires: expiresIn,
        // TODO: uncomment the following line when deploying to production
        // secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
        path: "/",
        httpOnly: false, // Must be false to allow client-side JavaScript access
        sameSite: "lax", // 'lax' is more permissive than 'strict' for cross-site requests
        // Don't set domain explicitly unless you have a specific domain requirement
    });
};

// remove session token
export const removeSession = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("access-token");
};
