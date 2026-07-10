import { ApiError } from "@/lib/api/error";
import { isApiResponse } from "@/lib/api/guards";

export async function localApiGet<TData>(path: string) {
  const response = await fetch(path, {
    method: "GET",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!isApiResponse(payload)) {
    throw new ApiError({
      code: "INVALID_API_RESPONSE",
      data: null,
      message: "API 응답 형식이 올바르지 않습니다.",
      response: payload,
      status: response.status,
    });
  }

  if (payload.result === "ERROR" || !response.ok) {
    throw new ApiError({
      code: payload.result === "ERROR" ? payload.error.code : "HTTP_ERROR",
      data: payload.result === "ERROR" ? payload.error.data : null,
      message: payload.result === "ERROR" ? payload.error.message : "API 요청에 실패했습니다.",
      response: payload,
      status: response.status,
    });
  }

  return payload.data as TData;
}

export async function localApiPost<TData, TBody = unknown>(path: string, body?: TBody) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!isApiResponse(payload)) {
    throw new ApiError({
      code: "INVALID_API_RESPONSE",
      data: null,
      message: "API 응답 형식이 올바르지 않습니다.",
      response: payload,
      status: response.status,
    });
  }

  if (payload.result === "ERROR" || !response.ok) {
    throw new ApiError({
      code: payload.result === "ERROR" ? payload.error.code : "HTTP_ERROR",
      data: payload.result === "ERROR" ? payload.error.data : null,
      message: payload.result === "ERROR" ? payload.error.message : "API 요청에 실패했습니다.",
      response: payload,
      status: response.status,
    });
  }

  return payload.data as TData;
}

