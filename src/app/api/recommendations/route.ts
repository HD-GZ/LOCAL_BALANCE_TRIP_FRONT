import { cookies } from "next/headers";

import { RECOMMENDATION_GENERATION_TIMEOUT } from "@/features/recommendation/constants";
import { callBackendWithAuthRetry } from "@/lib/auth/bffHandler";

export async function POST() {
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "POST",
    path: "/recommendations",
    timeout: RECOMMENDATION_GENERATION_TIMEOUT,
  });
}
