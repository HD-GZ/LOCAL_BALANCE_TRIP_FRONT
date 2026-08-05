"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { createSessionStore } from "@/lib/storage/sessionStore";

const PASSWORD_RESET_STORAGE_KEY = "local-balance-trip:password-reset";

const passwordResetSessionSchema = z.object({
  email: z.string(),
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
  passwordResetStore.set({
    email,
    codeExpiresAt: Date.now() + verificationCodeExpiresIn * 1000,
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
