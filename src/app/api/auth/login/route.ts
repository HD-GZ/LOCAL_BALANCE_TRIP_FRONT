import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { API_CLIENT_ERROR_CODE } from "@/lib/api/errorCodes";
import { isApiResponse } from "@/lib/api/guards";
import { errorResponse } from "@/lib/auth/bffHandler";
import { setAuthCookies } from "@/lib/auth/cookies";
import { authTokenSchema } from "@/lib/auth/schema";
import { API_BASE_URL } from "@/lib/config/server";

const LOGIN_TIMEOUT = 10_000;
const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function makeLoginUrl() {
  return new URL("/auth/login", API_BASE_URL);
}

function makeInvalidResponse() {
  return NextResponse.json(
    {
      result: "ERROR",
      data: null,
      error: {
        code: "INVALID_API_RESPONSE",
        message: "API 응답 형식이 올바르지 않습니다.",
        data: null,
      },
    },
    { status: 502 },
  );
}

export async function POST(request: Request) {
  const body = loginRequestSchema.safeParse(await request.json().catch(() => null));

  if (!body.success) {
    return errorResponse(400, "INVALID_REQUEST", "로그인 요청 형식이 올바르지 않습니다.");
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), LOGIN_TIMEOUT);

  try {
    const backendResponse = await fetch(makeLoginUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body.data),
      cache: "no-store",
      signal: abortController.signal,
    });
    const payload: unknown = await backendResponse.json().catch(() => null);

    if (!isApiResponse(payload)) {
      return makeInvalidResponse();
    }

    if (payload.result === "ERROR" || !backendResponse.ok) {
      return NextResponse.json(payload, { status: backendResponse.status });
    }

    const tokens = authTokenSchema.safeParse(payload.data);

    if (!tokens.success) {
      return makeInvalidResponse();
    }

    const cookieStore = await cookies();
    setAuthCookies(cookieStore, tokens.data);

    return NextResponse.json({
      result: "SUCCESS",
      data: null,
      error: null,
    });
  } catch (error) {
    return error instanceof Error && error.name === "AbortError"
      ? errorResponse(504, API_CLIENT_ERROR_CODE.TIMEOUT, "요청 시간이 초과되었습니다.")
      : errorResponse(
          502,
          API_CLIENT_ERROR_CODE.NETWORK_ERROR,
          "네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
  } finally {
    clearTimeout(timeoutId);
  }
}
