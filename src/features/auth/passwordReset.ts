/** 백엔드가 만료 시간을 알려주지 못하는 경우(계정 미존재 등)에 사용하는 기본 인증 코드 유효 시간(초). */
export const DEFAULT_VERIFICATION_CODE_EXPIRES_IN = 600;

/** 인증번호 재전송 쿨다운(초). */
export const RESEND_CODE_COOLDOWN_SECONDS = 60;

export const PASSWORD_RESET_ERROR_CODE = {
  CODE_EXPIRED: "PASSWORD_RESET_CODE_EXPIRED",
  CODE_NOT_FOUND: "PASSWORD_RESET_CODE_NOT_FOUND",
  CODE_USED: "PASSWORD_RESET_CODE_USED",
  TOKEN_EXPIRED: "PASSWORD_RESET_TOKEN_EXPIRED",
  TOKEN_NOT_FOUND: "PASSWORD_RESET_TOKEN_NOT_FOUND",
  TOKEN_USED: "PASSWORD_RESET_TOKEN_USED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
} as const;

/** 처음 단계부터 다시 진행해야 하는 리셋 토큰 오류인지 판별한다. */
export function isResetTokenInvalidCode(code: string) {
  return (
    code === PASSWORD_RESET_ERROR_CODE.TOKEN_EXPIRED ||
    code === PASSWORD_RESET_ERROR_CODE.TOKEN_USED ||
    code === PASSWORD_RESET_ERROR_CODE.TOKEN_NOT_FOUND
  );
}
