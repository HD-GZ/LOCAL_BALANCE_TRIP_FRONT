import { isApiFieldError } from "@/lib/api/guards";
import type { ApiErrorData, ApiResponse } from "@/lib/api/types";

const CLIENT_ERROR_MESSAGE_KEYS: Record<string, string> = {
  NETWORK_ERROR: "networkError",
  TIMEOUT: "timeout",
  CANCELED: "canceled",
  INVALID_API_RESPONSE: "invalidResponse",
  HTTP_ERROR: "httpError",
};

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

/**
 * client.ts가 자체 생성하는 에러만 이걸로 번역하고, 그 외(백엔드/BFF가 이미 로케일에 맞게 만들어 보낸 에러)는 error.message를 그대로 쓴다.
 */
export function getApiErrorMessage(error: ApiError, t: (key: string) => string) {
  const key = CLIENT_ERROR_MESSAGE_KEYS[error.code];

  return key ? t(key) : error.message;
}
