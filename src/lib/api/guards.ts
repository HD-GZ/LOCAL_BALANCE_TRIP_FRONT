import { apiErrorBodySchema, apiFieldErrorSchema, apiResponseSchema } from "@/lib/api/schema";
import type { ApiErrorBody, ApiFieldError, ApiResponse } from "@/lib/api/types";

export function isApiErrorBody(error: unknown): error is ApiErrorBody {
  return apiErrorBodySchema.safeParse(error).success;
}

export function isApiFieldError(error: unknown): error is ApiFieldError {
  return apiFieldErrorSchema.safeParse(error).success;
}

export function isApiResponse(payload: unknown): payload is ApiResponse<unknown> {
  return apiResponseSchema.safeParse(payload).success;
}
