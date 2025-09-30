"use server";

import axios from "axios";
import { cookies } from "next/headers";

export const axiosWrapper = axios.create({
    baseURL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for client-side token handling
axiosWrapper.interceptors.request.use(
    async (config) => {
        // Get token from js-cookie
        const cookieStore = await cookies();
        const token = cookieStore.get("access-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token.value}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Function to set auth token
export const setAuthToken = async (token: string | null) => {
    if (token) {
        axiosWrapper.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosWrapper.defaults.headers.common["Authorization"];
    }
};
