import { z } from "zod";

import { callBackend, errorResponse } from "@/lib/auth/bffHandler";

const policyTypeParamSchema = z.enum(["service", "privacy", "marketing"]);

export async function GET(_request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const parsedType = policyTypeParamSchema.safeParse(type);

  if (!parsedType.success) {
    return errorResponse(400, "INVALID_TERMS_TYPE", "약관 종류가 올바르지 않습니다.");
  }

  return callBackend({ method: "GET", path: `/terms/${parsedType.data}` });
}
