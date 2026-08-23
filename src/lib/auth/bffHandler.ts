import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { API_CLIENT_ERROR_CODE } from "@/lib/api/errorCodes";
import { isApiResponse } from "@/lib/api/guards";
import type { ApiResponse } from "@/lib/api/types";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
  type CookieWriter,
} from "@/lib/auth/cookies";
import { requestTokenRefresh } from "@/lib/auth/refresh";
import { API_BASE_URL } from "@/lib/config/server";

const DEFAULT_BACKEND_FETCH_TIMEOUT = 10_000;

async function resolveAcceptLanguage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  return hasLocale(routing.locales, localeCookie) ? localeCookie : routing.defaultLocale;
}

export type CookieStore = CookieWriter & {
  get(name: string): { value: string } | undefined;
};

export type BackendRequestInit = {
  method: string;
  path: string;
  body?: unknown;
  timeout?: number;
};

export function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    {
      result: "ERROR",
      data: null,
      error: {
        code,
        message,
        data: null,
      },
    },
    { status },
  );
}

type BackendCallResult =
  | { kind: "timeout" }
  | { kind: "network-error" }
  | { kind: "invalid-response" }
  | { kind: "response"; status: number; payload: ApiResponse<unknown> };

async function fetchBackendOnce(
  accessToken: string | undefined,
  init: BackendRequestInit,
): Promise<BackendCallResult> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(
    () => abortController.abort(),
    init.timeout ?? DEFAULT_BACKEND_FETCH_TIMEOUT,
  );

  try {
    const backendResponse = await fetch(new URL(init.path, API_BASE_URL), {
      method: init.method,
      headers: {
        Accept: "application/json",
        "Accept-Language": await resolveAcceptLanguage(),
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: abortController.signal,
    });

    const payload: unknown = await backendResponse.json().catch(() => null);

    if (!isApiResponse(payload)) {
      return { kind: "invalid-response" };
    }

    return { kind: "response", status: backendResponse.status, payload };
  } catch (error) {
    return error instanceof Error && error.name === "AbortError"
      ? { kind: "timeout" }
      : { kind: "network-error" };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function callBackend(init: BackendRequestInit) {
  return finalizeBackendResult(await fetchBackendOnce(undefined, init));
}

export async function callBackendWithJsonBody(request: Request, path: string) {
  const body: unknown = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse(400, "INVALID_REQUEST_BODY", "요청 본문이 올바르지 않습니다.");
  }

  return callBackend({ method: "POST", path, body });
}

function finalizeBackendResult(result: BackendCallResult) {
  if (result.kind === "timeout") {
    return errorResponse(504, API_CLIENT_ERROR_CODE.TIMEOUT, "요청 시간이 초과되었습니다.");
  }

  if (result.kind === "network-error") {
    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.NETWORK_ERROR,
      "네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    );
  }

  if (result.kind === "invalid-response") {
    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.INVALID_API_RESPONSE,
      "API 응답 형식이 올바르지 않습니다.",
    );
  }

  return NextResponse.json(result.payload, { status: result.status });
}

export async function callBackendOptionalAuth(cookieStore: CookieStore, init: BackendRequestInit) {
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken) {
    const result = await fetchBackendOnce(accessToken, init);

    if (!(result.kind === "response" && result.status === 401)) {
      return finalizeBackendResult(result);
    }
  }

  const refreshTokenValue = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (refreshTokenValue) {
    const tokens = await requestTokenRefresh(refreshTokenValue);

    if (tokens) {
      setAuthCookies(cookieStore, tokens);

      const retryResult = await fetchBackendOnce(tokens.accessToken, init);

      if (!(retryResult.kind === "response" && retryResult.status === 401)) {
        return finalizeBackendResult(retryResult);
      }
    }

    clearAuthCookies(cookieStore);
  }

  return finalizeBackendResult(await fetchBackendOnce(undefined, init));
}

export async function callBackendWithAuthRetry(cookieStore: CookieStore, init: BackendRequestInit) {
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken) {
    const result = await fetchBackendOnce(accessToken, init);

    if (!(result.kind === "response" && result.status === 401)) {
      return finalizeBackendResult(result);
    }
  }

  const refreshTokenValue = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshTokenValue) {
    clearAuthCookies(cookieStore);
    return errorResponse(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const tokens = await requestTokenRefresh(refreshTokenValue);

  if (!tokens) {
    clearAuthCookies(cookieStore);
    return errorResponse(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  setAuthCookies(cookieStore, tokens);

  const retryResult = await fetchBackendOnce(tokens.accessToken, init);

  return finalizeBackendResult(retryResult);
}
