import type { PropensityRequest, PropensityResult } from "./types";

const PROPENSITY_ANSWERS_STORAGE_KEY = "local-balance-trip:propensity-answers";
const PROPENSITY_RESULT_STORAGE_KEY = "local-balance-trip:propensity-result";

type StoredPropensityAnswers = {
  userId: number;
  answers: PropensityRequest;
};

type StoredPropensityResult = {
  userId: number;
  result: PropensityResult;
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

export function savePropensityResult(userId: number, result: PropensityResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    PROPENSITY_RESULT_STORAGE_KEY,
    JSON.stringify({ userId, result } satisfies StoredPropensityResult),
  );
}

export function getPropensityResult(userId: number): PropensityResult | null {
  if (typeof window === "undefined") return null;
  const item = window.localStorage.getItem(PROPENSITY_RESULT_STORAGE_KEY);
  if (!item) return null;

  try {
    const parsed = JSON.parse(item) as StoredPropensityResult;
    return parsed.userId === userId ? parsed.result : null;
  } catch {
    return null;
  }
}

export function clearPropensityResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROPENSITY_RESULT_STORAGE_KEY);
}
