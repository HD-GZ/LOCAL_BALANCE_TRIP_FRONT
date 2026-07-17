import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import { API_CLIENT_ERROR_CODE } from "@/lib/api/errorCodes";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
  type CookieWriter,
} from "@/lib/auth/cookies";
import { requestTokenRefresh } from "@/lib/auth/refresh";

const BACKEND_FETCH_TIMEOUT = 10_000;

export type CookieStore = CookieWriter & {
  get(name: string): { value: string } | undefined;
};

export type BackendRequestInit = {
  method: string;
  path: string;
  body?: unknown;
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
  | { kind: "response"; status: number; payload: ApiResponse<unknown> | null };

async function fetchBackendOnce(
  accessToken: string,
  init: BackendRequestInit,
): Promise<BackendCallResult> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), BACKEND_FETCH_TIMEOUT);

  let backendResponse: Response;

  try {
    backendResponse = await fetch(new URL(init.path, API_BASE_URL), {
      method: init.method,
      headers: {
        Accept: "application/json",
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${accessToken}`,
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: abortController.signal,
    });
  } catch (error) {
    return error instanceof Error && error.name === "AbortError"
      ? { kind: "timeout" }
      : { kind: "network-error" };
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = (await backendResponse.json().catch(() => null)) as ApiResponse<unknown> | null;

  return { kind: "response", status: backendResponse.status, payload };
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

  if (!result.payload) {
    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.INVALID_API_RESPONSE,
      "API 응답 형식이 올바르지 않습니다.",
    );
  }

  return NextResponse.json(result.payload, { status: result.status });
}

export async function callBackendWithAuthRetry(
  cookieStore: CookieStore,
  init: BackendRequestInit,
) {
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
