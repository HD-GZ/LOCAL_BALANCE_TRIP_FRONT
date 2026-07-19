import { cookies } from "next/headers";

import { callBackendWithAuthRetry, errorResponse } from "@/lib/auth/bffHandler";
import { positiveIntegerParamSchema } from "@/lib/validation/routeParams";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  const parsedCourseId = positiveIntegerParamSchema.safeParse(courseId);

  if (!parsedCourseId.success) {
    return errorResponse(400, "INVALID_COURSE_ID", "코스 ID가 올바르지 않습니다.");
  }

  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "POST",
    path: `/recommendations/courses/${parsedCourseId.data}/save`,
  });
}
