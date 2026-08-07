"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { createSessionStore } from "@/lib/storage/sessionStore";

const PENDING_EMAIL_VERIFICATION_STORAGE_KEY = "local-balance-trip:pending-email-verification";

const pendingEmailVerificationSchema = z.object({
  email: z.string(),
  expiresAt: z.number(),
});

const pendingEmailVerificationStore = createSessionStore(
  PENDING_EMAIL_VERIFICATION_STORAGE_KEY,
  pendingEmailVerificationSchema,
);

export function savePendingEmailVerification({
  email,
  verificationCodeExpiresIn,
}: {
  email: string;
  verificationCodeExpiresIn: number;
}) {
  pendingEmailVerificationStore.set({
    email,
    expiresAt: Date.now() + verificationCodeExpiresIn * 1000,
  });
}

export function getPendingEmailVerification() {
  return pendingEmailVerificationStore.get();
}

export function clearPendingEmailVerification() {
  pendingEmailVerificationStore.clear();
}

export function usePendingEmailVerification() {
  return useSyncExternalStore(
    pendingEmailVerificationStore.subscribe,
    pendingEmailVerificationStore.get,
    pendingEmailVerificationStore.getServerSnapshot,
  );
}
