import type { PropensityRequest } from "./types";

const PROPENSITY_ANSWERS_STORAGE_KEY = "local-balance-trip:propensity-answers";

type StoredPropensityAnswers = {
  userId: number;
  answers: PropensityRequest;
};

export function savePropensityAnswers(userId: number, answers: PropensityRequest) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    PROPENSITY_ANSWERS_STORAGE_KEY,
    JSON.stringify({ userId, answers } satisfies StoredPropensityAnswers),
  );
}

export function getPropensityAnswers(userId: number): PropensityRequest | null {
  if (typeof window === "undefined") return null;
  const item = window.sessionStorage.getItem(PROPENSITY_ANSWERS_STORAGE_KEY);
  if (!item) return null;

  try {
    const parsed = JSON.parse(item) as StoredPropensityAnswers;
    return parsed.userId === userId ? parsed.answers : null;
  } catch {
    return null;
  }
}

export function clearPropensityAnswers() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PROPENSITY_ANSWERS_STORAGE_KEY);
}
