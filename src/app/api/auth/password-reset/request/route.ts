import { NextResponse } from "next/server";

import {
  DEFAULT_VERIFICATION_CODE_EXPIRES_IN,
  PASSWORD_RESET_ERROR_CODE,
} from "@/features/auth/passwordReset";
import { isApiResponse } from "@/lib/api/guards";
import { callBackendWithJsonBody } from "@/lib/auth/bffHandler";

async function isUserNotFound(response: NextResponse) {
  if (response.status !== 404) {
    return false;
  }

  const payload: unknown = await response
    .clone()
    .json()
    .catch(() => null);

  return (
    isApiResponse(payload) &&
    payload.result === "ERROR" &&
    payload.error.code === PASSWORD_RESET_ERROR_CODE.USER_NOT_FOUND
  );
}

export async function POST(request: Request) {
  const response = await callBackendWithJsonBody(request, "/auth/password-reset/request");

  // 가입 이력이 없는 이메일도 가입된 이메일과 동일한 응답을 돌려준다.
  // 백엔드의 USER_NOT_FOUND를 그대로 전달하면 이 엔드포인트만으로 계정 존재 여부를 알아낼 수 있다.
  if (await isUserNotFound(response)) {
    return NextResponse.json({
      result: "SUCCESS",
      data: { verificationCodeExpiresIn: DEFAULT_VERIFICATION_CODE_EXPIRES_IN },
      error: null,
    });
  }

  return response;
}
