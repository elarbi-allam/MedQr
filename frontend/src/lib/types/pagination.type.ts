import { z } from "zod";

import { ORDER_OPTIONS } from "../enums/order";

export type PaginationParams = {
    order: z.infer<typeof ORDER_OPTIONS>;
    page: number;
    take: number;
};
