import { cookies } from "next/headers";

import { callBackendWithAuthRetry } from "@/lib/auth/bffHandler";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  const cookieStore = await cookies();

  const response = await callBackendWithAuthRetry(cookieStore, {
    method: "POST",
    path: "/auth/logout",
  });

  clearAuthCookies(cookieStore);

  return response;
}
