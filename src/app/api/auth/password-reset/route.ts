import { cookies } from "next/headers";

import { callBackendWithJsonBody } from "@/lib/auth/bffHandler";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const response = await callBackendWithJsonBody(request, "/auth/password-reset");

  // 비밀번호 변경 시 백엔드가 모든 세션을 만료시키므로 이 브라우저의 쿠키도 함께 정리한다.
  if (response.ok) {
    clearAuthCookies(await cookies());
  }

  return response;
}
