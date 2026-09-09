import { cookies } from "next/headers";

import { errorResponse, callBackendWithAuthRetry } from "@/lib/auth/bffHandler";
import { positiveIntegerParamSchema } from "@/lib/validation/routeParams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ savedCourseId: string }> },
) {
  const { savedCourseId } = await params;
  const parsedSavedCourseId = positiveIntegerParamSchema.safeParse(savedCourseId);

  if (!parsedSavedCourseId.success) {
    return errorResponse(400, "INVALID_SAVED_COURSE_ID", "저장 코스 ID가 올바르지 않습니다.");
  }

  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "GET",
    path: `/saved-courses/${parsedSavedCourseId.data}/report`,
  });
}
