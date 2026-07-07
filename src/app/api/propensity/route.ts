import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import { API_CLIENT_ERROR_CODE } from "@/lib/api/error-codes";

const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
const BACKEND_FETCH_TIMEOUT = 10_000;

function errorResponse(status: number, code: string, message: string) {
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

export async function GET() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return errorResponse(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), BACKEND_FETCH_TIMEOUT);

  let backendResponse: Response;

  try {
    backendResponse = await fetch(new URL("/propensity", API_BASE_URL), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: abortController.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return errorResponse(504, API_CLIENT_ERROR_CODE.TIMEOUT, "요청 시간이 초과되었습니다.");
    }

    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.NETWORK_ERROR,
      "네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = (await backendResponse.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!payload) {
    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.INVALID_API_RESPONSE,
      "API 응답 형식이 올바르지 않습니다.",
    );
  }

  return NextResponse.json(payload, { status: backendResponse.status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_REQUEST_BODY", "요청 본문이 올바르지 않습니다.");
  }

  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return errorResponse(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), BACKEND_FETCH_TIMEOUT);

  let backendResponse: Response;

  try {
    backendResponse = await fetch(new URL("/propensity", API_BASE_URL), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: abortController.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return errorResponse(504, API_CLIENT_ERROR_CODE.TIMEOUT, "요청 시간이 초과되었습니다.");
    }

    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.NETWORK_ERROR,
      "네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = (await backendResponse.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!payload) {
    return errorResponse(
      502,
      API_CLIENT_ERROR_CODE.INVALID_API_RESPONSE,
      "API 응답 형식이 올바르지 않습니다.",
    );
  }

  return NextResponse.json(payload, { status: backendResponse.status });
}
