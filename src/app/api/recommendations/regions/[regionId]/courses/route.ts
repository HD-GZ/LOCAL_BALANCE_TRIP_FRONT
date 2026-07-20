import { cookies } from "next/headers";

import { callBackendWithAuthRetry, errorResponse } from "@/lib/auth/bffHandler";
import { positiveIntegerParamSchema } from "@/lib/validation/routeParams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ regionId: string }> },
) {
  const { regionId } = await params;
  const parsedRegionId = positiveIntegerParamSchema.safeParse(regionId);

  if (!parsedRegionId.success) {
    return errorResponse(400, "INVALID_REGION_ID", "지역 ID가 올바르지 않습니다.");
  }

  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "GET",
    path: `/recommendations/regions/${parsedRegionId.data}/courses`,
  });
}
