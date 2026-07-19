import { z } from "zod";

export const positiveIntegerParamSchema = z.coerce.number().int().positive();
