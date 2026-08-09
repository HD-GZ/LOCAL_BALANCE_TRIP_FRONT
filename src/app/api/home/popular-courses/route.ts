import { cookies } from "next/headers";

import { callBackendOptionalAuth } from "@/lib/auth/bffHandler";

export async function GET() {
  const cookieStore = await cookies();

  return callBackendOptionalAuth(cookieStore, { method: "GET", path: "/home/popular-courses" });
}
