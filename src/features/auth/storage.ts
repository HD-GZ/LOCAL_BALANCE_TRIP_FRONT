"use client";

import { useSyncExternalStore } from "react";

const PENDING_EMAIL_VERIFICATION_STORAGE_KEY = "local-balance-trip:pending-email-verification";
const PENDING_EMAIL_VERIFICATION_STORAGE_EVENT = "pending-email-verification-change";

type PendingEmailVerification = {
  email: string;
  expiresAt: number;
};

let cachedPendingEmailVerificationRaw: string | null = null;
let cachedPendingEmailVerification: PendingEmailVerification | null = null;

const subscribePendingEmailVerification = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(PENDING_EMAIL_VERIFICATION_STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(PENDING_EMAIL_VERIFICATION_STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};
const getPendingEmailVerificationServerSnapshot = () => null;

function emitPendingEmailVerificationChange() {
  window.dispatchEvent(new Event(PENDING_EMAIL_VERIFICATION_STORAGE_EVENT));
}

export function savePendingEmailVerification({
  email,
  verificationCodeExpiresIn,
}: {
  email: string;
  verificationCodeExpiresIn: number;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const pendingEmailVerification = {
    email,
    expiresAt: Date.now() + verificationCodeExpiresIn * 1000,
  } satisfies PendingEmailVerification;

  window.sessionStorage.setItem(
    PENDING_EMAIL_VERIFICATION_STORAGE_KEY,
    JSON.stringify(pendingEmailVerification),
  );
  cachedPendingEmailVerificationRaw = JSON.stringify(pendingEmailVerification);
  cachedPendingEmailVerification = pendingEmailVerification;
  emitPendingEmailVerificationChange();
}

export function getPendingEmailVerification() {
  if (typeof window === "undefined") {
    return null;
  }

  const item = window.sessionStorage.getItem(PENDING_EMAIL_VERIFICATION_STORAGE_KEY);

  if (!item) {
    cachedPendingEmailVerificationRaw = null;
    cachedPendingEmailVerification = null;
    return null;
  }

  if (item === cachedPendingEmailVerificationRaw) {
    return cachedPendingEmailVerification;
  }

  try {
    const parsed = JSON.parse(item) as PendingEmailVerification;

    if (typeof parsed.email === "string" && typeof parsed.expiresAt === "number") {
      cachedPendingEmailVerificationRaw = item;
      cachedPendingEmailVerification = parsed;
      return parsed;
    }
  } catch {
    cachedPendingEmailVerificationRaw = null;
    cachedPendingEmailVerification = null;
    return null;
  }

  cachedPendingEmailVerificationRaw = null;
  cachedPendingEmailVerification = null;
  return null;
}

export function clearPendingEmailVerification() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PENDING_EMAIL_VERIFICATION_STORAGE_KEY);
  cachedPendingEmailVerificationRaw = null;
  cachedPendingEmailVerification = null;
  emitPendingEmailVerificationChange();
}

export function usePendingEmailVerification() {
  return useSyncExternalStore(
    subscribePendingEmailVerification,
    getPendingEmailVerification,
    getPendingEmailVerificationServerSnapshot,
  );
}
