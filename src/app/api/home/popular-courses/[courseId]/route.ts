import { cookies } from "next/headers";

import { callBackendOptionalAuth, errorResponse } from "@/lib/auth/bffHandler";
import { positiveIntegerParamSchema } from "@/lib/validation/routeParams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  const parsedCourseId = positiveIntegerParamSchema.safeParse(courseId);

  if (!parsedCourseId.success) {
    return errorResponse(400, "INVALID_COURSE_ID", "코스 ID가 올바르지 않습니다.");
  }

  const cookieStore = await cookies();

  return callBackendOptionalAuth(cookieStore, {
    method: "GET",
    path: `/home/popular-courses/${parsedCourseId.data}`,
  });
}
