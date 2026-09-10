import { NextResponse } from "next/server";
import { createTranslator } from "next-intl";

import { resolveLocaleFromCookie } from "@/i18n/resolveLocaleFromCookie";
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

/**
 * BFF 라우트는 proxy.ts의 matcher에서 제외돼 있어 next-intl 미들웨어를 안 거친다.
 * getTranslations()의 자동 로케일 감지에 기댈 수 없으므로 쿠키를 직접 읽는다.
 */
async function getBffTranslations() {
  const locale = await resolveLocaleFromCookie();
  const { default: messages } = await import(`../../../messages/${locale}/apiError.json`);

  return createTranslator({ locale, messages, namespace: "apiError" });
}

async function unauthorizedResponse() {
  const t = await getBffTranslations();

  return errorResponse(401, "UNAUTHORIZED", t("unauthorized"));
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
        "Accept-Language": await resolveLocaleFromCookie(),
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
    const t = await getBffTranslations();

    return errorResponse(400, "INVALID_REQUEST_BODY", t("invalidRequestBody"));
  }

  return callBackend({ method: "POST", path, body });
}

async function finalizeBackendResult(result: BackendCallResult) {
  if (result.kind === "timeout") {
    const t = await getBffTranslations();

    return errorResponse(504, API_CLIENT_ERROR_CODE.TIMEOUT, t("timeout"));
  }

  if (result.kind === "network-error") {
    const t = await getBffTranslations();

    return errorResponse(502, API_CLIENT_ERROR_CODE.NETWORK_ERROR, t("networkError"));
  }

  if (result.kind === "invalid-response") {
    const t = await getBffTranslations();

    return errorResponse(502, API_CLIENT_ERROR_CODE.INVALID_API_RESPONSE, t("invalidResponse"));
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
    return unauthorizedResponse();
  }

  const tokens = await requestTokenRefresh(refreshTokenValue);

  if (!tokens) {
    clearAuthCookies(cookieStore);
    return unauthorizedResponse();
  }

  setAuthCookies(cookieStore, tokens);

  const retryResult = await fetchBackendOnce(tokens.accessToken, init);

  return finalizeBackendResult(retryResult);
}
