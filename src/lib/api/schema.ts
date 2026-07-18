import { z } from "zod";

export const apiFieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const apiErrorDataSchema = z.union([
  z.array(apiFieldErrorSchema),
  z.record(z.string(), z.unknown()),
  z.null(),
]);

export const apiErrorBodySchema = z.object({
  code: z.string(),
  message: z.string(),
  data: apiErrorDataSchema,
});

export const apiResponseSchema = z.discriminatedUnion("result", [
  z.object({
    result: z.literal("SUCCESS"),
    data: z.unknown(),
    error: z.null(),
  }),
  z.object({
    result: z.literal("ERROR"),
    data: z.null(),
    error: apiErrorBodySchema,
  }),
]);
