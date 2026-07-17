export { API_BASE_URL, apiClient } from "@/lib/api/client";
export { API_CLIENT_ERROR_CODE } from "@/lib/api/errorCodes";
export { ApiError, getFieldErrors, isApiError } from "@/lib/api/error";
export { isApiErrorBody, isApiFieldError, isApiResponse } from "@/lib/api/guards";
export type { ApiClientErrorCode } from "@/lib/api/errorCodes";
export type {
  ApiErrorBody,
  ApiErrorData,
  ApiFailureResponse,
  ApiFieldError,
  ApiResponse,
  ApiResult,
  ApiSuccessResponse,
} from "@/lib/api/types";
