import type { PropensityRequest, PropensityResult } from "./types";

const MEDIAN_ANSWER_VALUE = 3;

function normalizeLegacyAnswers(answers: PropensityRequest): PropensityRequest {
  const normalizeGroup = <T extends Record<string, number>>(group: T): T =>
    Object.fromEntries(
      Object.entries(group).map(([key, value]) => [
        key,
        value === 0 ? MEDIAN_ANSWER_VALUE : value,
      ]),
    ) as T;
  return {
    preference: normalizeGroup(answers.preference),
    valueConsumption: normalizeGroup(answers.valueConsumption),
  };
}

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

let cachedAnswersCacheKey: string | null = null;
let cachedAnswersValue: PropensityRequest | null = null;

// useSyncExternalStore는 매 렌더마다 이 함수를 호출해 이전 결과와 참조를 비교한다.
export function getPropensityAnswers(userId: number): PropensityRequest | null {
  if (typeof window === "undefined") return null;
  const item = window.sessionStorage.getItem(PROPENSITY_ANSWERS_STORAGE_KEY);
  const cacheKey = `${userId}:${item}`;
  if (cacheKey === cachedAnswersCacheKey) return cachedAnswersValue;
  cachedAnswersCacheKey = cacheKey;

  if (!item) {
    cachedAnswersValue = null;
    return null;
  }

  try {
    const parsed = JSON.parse(item) as StoredPropensityAnswers;
    cachedAnswersValue =
      parsed.userId === userId ? normalizeLegacyAnswers(parsed.answers) : null;
  } catch {
    cachedAnswersValue = null;
  }
  return cachedAnswersValue;
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

let cachedResultCacheKey: string | null = null;
let cachedResultValue: PropensityResult | null = null;

// useSyncExternalStore는 매 렌더마다 이 함수를 호출해 이전 결과와 참조를 비교한다.
export function getPropensityResult(userId: number): PropensityResult | null {
  if (typeof window === "undefined") return null;
  const item = window.localStorage.getItem(PROPENSITY_RESULT_STORAGE_KEY);
  const cacheKey = `${userId}:${item}`;
  if (cacheKey === cachedResultCacheKey) return cachedResultValue;
  cachedResultCacheKey = cacheKey;

  if (!item) {
    cachedResultValue = null;
    return null;
  }

  try {
    const parsed = JSON.parse(item) as StoredPropensityResult;
    cachedResultValue = parsed.userId === userId ? parsed.result : null;
  } catch {
    cachedResultValue = null;
  }
  return cachedResultValue;
}

export function clearPropensityResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROPENSITY_RESULT_STORAGE_KEY);
}
