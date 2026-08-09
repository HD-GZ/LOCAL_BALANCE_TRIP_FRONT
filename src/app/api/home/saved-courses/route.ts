import { cookies } from "next/headers";

import { callBackendWithAuthRetry } from "@/lib/auth/bffHandler";

export async function GET() {
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, { method: "GET", path: "/home/saved-courses" });
}
