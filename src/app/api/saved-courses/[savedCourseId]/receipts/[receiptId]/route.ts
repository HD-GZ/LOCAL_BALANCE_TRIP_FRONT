import { cookies } from "next/headers";
import { errorResponse, callBackendWithAuthRetry } from "@/lib/auth/bffHandler";
import { positiveIntegerParamSchema } from "@/lib/validation/routeParams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ savedCourseId: string; receiptId: string }> },
) {
  const { savedCourseId, receiptId } = await params;
  const parsedSavedCourseId = positiveIntegerParamSchema.safeParse(savedCourseId);
  const parsedReceiptId = positiveIntegerParamSchema.safeParse(receiptId);

  if (!parsedSavedCourseId.success) {
    return errorResponse(400, "INVALID_SAVED_COURSE_ID", "저장 코스 ID가 올바르지 않습니다.");
  }
  if (!parsedReceiptId.success) {
    return errorResponse(400, "INVALID_RECEIPT_ID", "영수증 ID가 올바르지 않습니다.");
  }
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "GET",
    path: `/saved-courses/${parsedSavedCourseId.data}/receipts/${parsedReceiptId.data}`,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ savedCourseId: string; receiptId: string }> },
) {
  const { savedCourseId, receiptId } = await params;
  const parsedSavedCourseId = positiveIntegerParamSchema.safeParse(savedCourseId);
  const parsedReceiptId = positiveIntegerParamSchema.safeParse(receiptId);

  if (!parsedSavedCourseId.success) {
    return errorResponse(400, "INVALID_SAVED_COURSE_ID", "저장 코스 ID가 올바르지 않습니다.");
  }
  if (!parsedReceiptId.success) {
    return errorResponse(400, "INVALID_RECEIPT_ID", "영수증 ID가 올바르지 않습니다.");
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_REQUEST_BODY", "요청 본문이 올바르지 않습니다.");
  }

  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "PATCH",
    path: `/saved-courses/${parsedSavedCourseId.data}/receipts/${parsedReceiptId.data}`,
    body,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ savedCourseId: string; receiptId: string }> },
) {
  const { savedCourseId, receiptId } = await params;
  const parsedSavedCourseId = positiveIntegerParamSchema.safeParse(savedCourseId);
  const parsedReceiptId = positiveIntegerParamSchema.safeParse(receiptId);

  if (!parsedSavedCourseId.success) {
    return errorResponse(400, "INVALID_SAVED_COURSE_ID", "저장 코스 ID가 올바르지 않습니다.");
  }
  if (!parsedReceiptId.success) {
    return errorResponse(400, "INVALID_RECEIPT_ID", "영수증 ID가 올바르지 않습니다.");
  }
  const cookieStore = await cookies();

  return callBackendWithAuthRetry(cookieStore, {
    method: "DELETE",
    path: `/saved-courses/${parsedSavedCourseId.data}/receipts/${parsedReceiptId.data}`,
  });
}
