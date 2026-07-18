import { z } from "zod";

import { callBackend, errorResponse } from "@/lib/auth/bffHandler";

const emailSchema = z.string().email();

export async function GET(request: Request) {
  const email = emailSchema.safeParse(new URL(request.url).searchParams.get("email"));

  if (!email.success) {
    return errorResponse(400, "INVALID_EMAIL", "이메일 형식이 올바르지 않습니다.");
  }

  return callBackend({
    method: "GET",
    path: `/users/email-availability?email=${encodeURIComponent(email.data)}`,
  });
}
