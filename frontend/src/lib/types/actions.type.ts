import { MetaType } from "./meta.type";

export type ActionsResponse<T> = {
    status: "SUCCESS" | "ERROR";
    statusCode: number;
    message: string;
    source?: string;
    data: T | null;
    meta?: MetaType;
};
