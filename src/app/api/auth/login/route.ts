import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { AuthToken, LoginRequest } from "@/features/auth/types";
import { API_BASE_URL } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import { setAuthCookies } from "@/lib/auth/cookies";

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
  const body = (await request.json()) as LoginRequest;
  const backendResponse = await fetch(makeLoginUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await backendResponse.json().catch(() => null)) as ApiResponse<AuthToken> | null;

  if (!payload) {
    return makeInvalidResponse();
  }

  if (payload.result === "ERROR" || !backendResponse.ok) {
    return NextResponse.json(payload, { status: backendResponse.status });
  }

  const cookieStore = await cookies();

  setAuthCookies(cookieStore, payload.data);

  return NextResponse.json({
    result: "SUCCESS",
    data: null,
    error: null,
  });
}
