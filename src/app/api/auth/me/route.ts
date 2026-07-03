import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";

const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

export async function GET() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        result: "ERROR",
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "로그인이 필요합니다.",
          data: null,
        },
      },
      { status: 401 },
    );
  }

  const backendResponse = await fetch(new URL("/users/me", API_BASE_URL), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN_COOKIE_NAME}`,
    },
    cache: "no-store",
  });

  const payload = (await backendResponse.json().catch(() => null)) as ApiResponse<unknown> | null;

  if (!payload) {
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

  return NextResponse.json(payload, { status: backendResponse.status });
}
