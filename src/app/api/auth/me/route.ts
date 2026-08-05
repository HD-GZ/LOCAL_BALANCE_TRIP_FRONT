import { cookies } from "next/headers";

import { callBackendWithAuthRetry } from "@/lib/auth/bffHandler";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function GET() {
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, { method: "GET", path: "/users/me" });
}

export async function PATCH(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, { method: "PATCH", path: "/users/me", body });
}

export async function DELETE() {
  const cookieStore = await cookies();

  const response = await callBackendWithAuthRetry(cookieStore, {
    method: "DELETE",
    path: "/users/me",
  });

  // 탈퇴한 계정으로 로그인 상태가 남지 않도록 쿠키를 정리한다.
  if (response.ok) {
    clearAuthCookies(cookieStore);
  }

  return response;
}
