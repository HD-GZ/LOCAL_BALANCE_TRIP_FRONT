import { ApiError } from "@/lib/api/error";
import { API_CLIENT_ERROR_CODE } from "@/lib/api/error-codes";
import { isApiResponse } from "@/lib/api/guards";

const DEFAULT_API_BASE_URL = "https://api.stage.lb-trip.live";
const DEFAULT_TIMEOUT = 10_000;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

type QueryParamValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

export type ApiClientOptions<TBody = unknown> = Omit<RequestInit, "body"> & {
  body?: TBody;
  params?: QueryParams;
  timeout?: number;
};

function buildUrl(path: string, params?: QueryParams) {
  const url = new URL(path, API_BASE_URL);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      if (item !== null && item !== undefined) {
        url.searchParams.append(key, String(item));
      }
    });
  });

  return url;
}

function isFetchNetworkError(error: unknown): error is TypeError {
  if (!(error instanceof TypeError)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("failed to fetch") ||
    message.includes("load failed") ||
    message.includes("networkerror") ||
    message.includes("network request failed")
  );
}

function createNetworkApiError() {
  return new ApiError({
    code: API_CLIENT_ERROR_CODE.NETWORK_ERROR,
    data: null,
    message: "네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    name: "NetworkError",
    status: 0,
  });
}

function createTimeoutApiError() {
  return new ApiError({
    code: API_CLIENT_ERROR_CODE.TIMEOUT,
    data: null,
    message: "요청 시간이 초과되었습니다.",
    name: "TimeoutError",
    status: 0,
  });
}

function createCanceledApiError() {
  return new ApiError({
    code: API_CLIENT_ERROR_CODE.CANCELED,
    data: null,
    message: "요청이 취소되었습니다.",
    name: "CanceledError",
    status: 0,
  });
}

function rethrowFetchError(error: unknown, didTimeout: boolean): never {
  if (error instanceof Error && error.name === "AbortError") {
    throw didTimeout ? createTimeoutApiError() : createCanceledApiError();
  }

  if (isFetchNetworkError(error)) {
    throw createNetworkApiError();
  }

  throw error;
}

function isFormBody(body: unknown): body is BodyInit {
  return (
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
    typeof body === "string"
  );
}

function makeRequestBody(body: unknown) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isFormBody(body)) {
    return body;
  }

  return JSON.stringify(body);
}

function isJsonBody(body: unknown) {
  return body !== undefined && body !== null && !isFormBody(body);
}

async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function sendRequest<TData, TBody = unknown>(
  path: string,
  options: ApiClientOptions<TBody> = {},
) {
  const { body, headers, params, timeout = DEFAULT_TIMEOUT, ...init } = options;
  const requestHeaders = new Headers(headers);
  const abortController = new AbortController();
  let didTimeout = false;
  const cancelRequest = () => abortController.abort();

  const timeoutId = setTimeout(() => {
    didTimeout = true;
    abortController.abort();
  }, timeout);

  init.signal?.addEventListener("abort", cancelRequest, { once: true });

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (isJsonBody(body) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, params), {
      ...init,
      body: makeRequestBody(body),
      credentials: init.credentials ?? "include",
      headers: requestHeaders,
      signal: abortController.signal,
    });
  } catch (error) {
    rethrowFetchError(error, didTimeout);
  } finally {
    clearTimeout(timeoutId);
    init.signal?.removeEventListener("abort", cancelRequest);
  }

  const payload = await parseJson(response);

  if (!isApiResponse(payload)) {
    throw new ApiError({
      code: API_CLIENT_ERROR_CODE.INVALID_API_RESPONSE,
      data: null,
      message: "API 응답 형식이 올바르지 않습니다.",
      response: payload,
      status: response.status,
    });
  }

  if (payload.result === "ERROR") {
    throw new ApiError({
      code: payload.error.code,
      data: payload.error.data,
      message: payload.error.message,
      response: payload,
      status: response.status,
    });
  }

  if (!response.ok) {
    throw new ApiError({
      code: API_CLIENT_ERROR_CODE.HTTP_ERROR,
      data: null,
      message: "API 요청에 실패했습니다.",
      response: payload,
      status: response.status,
    });
  }

  return payload.data as TData;
}

export const apiClient = {
  delete: <TData, TBody = unknown>(path: string, options: ApiClientOptions<TBody> = {}) =>
    sendRequest<TData, TBody>(path, { ...options, method: "DELETE" }),
  get: <TData>(path: string, options: ApiClientOptions = {}) =>
    sendRequest<TData>(path, { ...options, method: "GET" }),
  patch: <TData, TBody = unknown>(path: string, options: ApiClientOptions<TBody> = {}) =>
    sendRequest<TData, TBody>(path, { ...options, method: "PATCH" }),
  post: <TData, TBody = unknown>(path: string, options: ApiClientOptions<TBody> = {}) =>
    sendRequest<TData, TBody>(path, { ...options, method: "POST" }),
  put: <TData, TBody = unknown>(path: string, options: ApiClientOptions<TBody> = {}) =>
    sendRequest<TData, TBody>(path, { ...options, method: "PUT" }),
  request: sendRequest,
};
