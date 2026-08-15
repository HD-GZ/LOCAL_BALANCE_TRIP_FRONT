import { cookies } from "next/headers";

import { callBackendWithAuthRetry } from "@/lib/auth/bffHandler";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "GET",
    path: query ? `/saved-courses?${query}` : "/saved-courses",
  });
}
