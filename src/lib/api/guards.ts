import type { ApiErrorBody, ApiFieldError, ApiResponse } from "@/lib/api/types";

export function isApiErrorBody(error: unknown): error is ApiErrorBody {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && "message" in error && typeof error.code === "string";
}

export function isApiFieldError(error: unknown): error is ApiFieldError {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "field" in error &&
    "message" in error &&
    typeof error.field === "string" &&
    typeof error.message === "string"
  );
}

export function isApiResponse(payload: unknown): payload is ApiResponse<unknown> {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (!("result" in payload) || !("data" in payload) || !("error" in payload)) {
    return false;
  }

  if (payload.result === "SUCCESS") {
    return payload.error === null;
  }

  if (payload.result === "ERROR") {
    return payload.data === null && isApiErrorBody(payload.error);
  }

  return false;
}
