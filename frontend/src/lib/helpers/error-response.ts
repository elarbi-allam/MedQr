import { AxiosError } from "axios";
import { ActionsResponse } from "../types/actions.type";

export function errorResponse(
    error: unknown,
    source?: string
): ActionsResponse<null> {
    const message =
        error instanceof AxiosError && error.response?.data.message
            ? error.response?.data.message
            : "Une erreur est survenue";
    const statusCode =
        error instanceof AxiosError ? (error.response?.status as number) : 500;
    return {
        status: "ERROR",
        statusCode,
        message,
        source,
        data: null,
    };
}
