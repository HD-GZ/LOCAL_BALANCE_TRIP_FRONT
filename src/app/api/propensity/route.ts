import { cookies } from "next/headers";

import { callBackendWithAuthRetry, errorResponse } from "@/lib/auth/bffHandler";

export async function GET() {
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, { method: "GET", path: "/propensity" });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_REQUEST_BODY", "요청 본문이 올바르지 않습니다.");
  }

  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, { method: "POST", path: "/propensity", body });
}
