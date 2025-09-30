import { z } from "zod";

export const ORDER_OPTIONS = z.enum(["ASC", "DESC"]);
