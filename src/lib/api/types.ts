export type ApiResult = "SUCCESS" | "ERROR";

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorData = ApiFieldError[] | Record<string, unknown> | null;

export type ApiErrorBody = {
  code: string;
  message: string;
  data: ApiErrorData;
};

export type ApiSuccessResponse<TData> = {
  result: "SUCCESS";
  data: TData;
  error: null;
};

export type ApiFailureResponse = {
  result: "ERROR";
  data: null;
  error: ApiErrorBody;
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiFailureResponse;
