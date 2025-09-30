import { z } from "zod";

export const ROLE_OPTIONS = z.enum(["ADMIN", "USER"]);
