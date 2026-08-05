"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { createSessionStore } from "@/lib/storage/sessionStore";

const PASSWORD_RESET_STORAGE_KEY = "local-balance-trip:password-reset";

const passwordResetSessionSchema = z.object({
  email: z.string(),
  /** 인증 코드를 마지막으로 발송한 시각. 재전송 쿨다운이 새로고침에도 유지되도록 보관한다. */
  codeSentAt: z.number(),
  codeExpiresAt: z.number(),
  resetToken: z.string().optional(),
  resetTokenExpiresAt: z.number().optional(),
});

export type PasswordResetSession = z.infer<typeof passwordResetSessionSchema>;

const passwordResetStore = createSessionStore(
  PASSWORD_RESET_STORAGE_KEY,
  passwordResetSessionSchema,
);

/** 인증 코드 발송(요청/재전송) 직후 상태. 이전에 발급받은 리셋 토큰은 무효화한다. */
export function savePasswordResetCodeRequest({
  email,
  verificationCodeExpiresIn,
}: {
  email: string;
  verificationCodeExpiresIn: number;
}) {
  const now = Date.now();

  passwordResetStore.set({
    email,
    codeSentAt: now,
    codeExpiresAt: now + verificationCodeExpiresIn * 1000,
  });
}

/** 인증 코드 확인 성공 시 발급된 일회용 리셋 토큰을 보관한다. */
export function savePasswordResetToken({
  resetToken,
  resetTokenExpiresIn,
}: {
  resetToken: string;
  resetTokenExpiresIn: number;
}) {
  const session = passwordResetStore.get();

  if (!session) {
    return;
  }

  passwordResetStore.set({
    ...session,
    resetToken,
    resetTokenExpiresAt: Date.now() + resetTokenExpiresIn * 1000,
  });
}

export function getPasswordResetSession() {
  return passwordResetStore.get();
}

/** 새 비밀번호 설정에 실제로 사용할 수 있는(발급됐고 아직 만료되지 않은) 리셋 토큰이 있는지 확인한다. */
export function hasUsableResetToken(
  session: PasswordResetSession | null,
): session is PasswordResetSession & { resetToken: string } {
  return Boolean(
    session?.resetToken && session.resetTokenExpiresAt && session.resetTokenExpiresAt > Date.now(),
  );
}

export function clearPasswordResetSession() {
  passwordResetStore.clear();
}

export function usePasswordResetSession() {
  return useSyncExternalStore(
    passwordResetStore.subscribe,
    passwordResetStore.get,
    passwordResetStore.getServerSnapshot,
  );
}
