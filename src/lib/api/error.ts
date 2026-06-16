import { isApiFieldError } from "@/lib/api/guards";
import type { ApiErrorData, ApiResponse } from "@/lib/api/types";

type ApiErrorOptions = {
  code: string;
  message: string;
  name?: string;
  status: number;
  data: ApiErrorData;
  response?: ApiResponse<unknown> | unknown;
};

export class ApiError extends Error {
  code: string;
  status: number;
  data: ApiErrorData;
  response?: ApiResponse<unknown> | unknown;

  constructor({ code, data, message, name = "ApiError", response, status }: ApiErrorOptions) {
    super(message);
    this.name = name;
    this.code = code;
    this.status = status;
    this.data = data;
    this.response = response;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getFieldErrors(error: ApiError) {
  if (!Array.isArray(error.data)) {
    return [];
  }

  return error.data.filter(isApiFieldError);
}
