"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import FlowShell from "@/components/common/FlowShell";
import { Button } from "@/components/ui/button";
import {
  propensityQueryKeys,
  usePostPropensityMutation,
  useGetPropensityResultQuery,
} from "@/features/propensity/queries";
import {
  clearPropensityAnswers,
  clearPropensityResult,
  getPropensityAnswers,
  getPropensityResult,
  savePropensityAnswers,
  savePropensityResult,
} from "@/features/propensity/storage";
import type { PropensityResult } from "@/features/propensity/types";
import { postRecommendations } from "@/features/recommendation/api";
import { useMeQuery } from "@/features/user/queries";
import { isApiError } from "@/lib/api/error";

import PropensityQuestionList from "./PropensityQuestionList";
import PropensityResultView from "./PropensityResult";

const SAVE_SPEND_OPTIONS = [
  { value: "save", label: "아끼기", description: "SAVE" },
  { value: "spend", label: "투자", description: "SPEND" },
];
const INITIAL_ANSWERS = {
  preference: {
    locality: 3,
    frugality: 3,
    experientiality: 3,
    vitality: 3,
    sociality: 3,
  },
  valueConsumption: {
    accommodation: 3,
    food: 3,
    experience: 3,
    transportation: 3,
    cafeExhibition: 3,
  },
};
const PROPENSITY_QUESTIONS = {
  1: [
    {
      id: "locality",
      title: "여행지 선택",
      options: [
        { value: "hotplace", label: "핫플", description: "유명·인기 명소" },
        { value: "local", label: "로컬", description: "골목·생활 상권" },
      ],
    },
    {
      id: "frugality",
      title: "소비 기준",
      options: [
        { value: "luxury", label: "럭셔리", description: "프리미엄·고급" },
        { value: "practical", label: "실속", description: "합리적 가성비" },
      ],
    },
    {
      id: "experientiality",
      title: "활동 방식",
      options: [
        { value: "spectator", label: "관람형", description: "보고 즐기기" },
        { value: "experience", label: "생활체험", description: "직접 해보기" },
      ],
    },
    {
      id: "vitality",
      title: "여행 강도",
      options: [
        { value: "relax", label: "휴식형", description: "느긋한 쉼" },
        { value: "active", label: "활동형", description: "부지런한 일정" },
      ],
    },
    {
      id: "sociality",
      title: "동행 유형",
      options: [
        { value: "solo", label: "혼행", description: "나 홀로" },
        { value: "family", label: "세대 동행", description: "가족·세대" },
      ],
    },
  ],
  2: [
    { id: "accommodation", title: "숙소", options: SAVE_SPEND_OPTIONS },
    { id: "food", title: "음식", options: SAVE_SPEND_OPTIONS },
    { id: "experience", title: "체험", options: SAVE_SPEND_OPTIONS },
    { id: "transportation", title: "이동", options: SAVE_SPEND_OPTIONS },
    { id: "cafeExhibition", title: "카페·전시", options: SAVE_SPEND_OPTIONS },
  ],
};
const VALID_STEPS = [1, 2, 3];
const STEPS = ["성향", "가치소비", "결과"];

const STEP_MENT: Record<number, { title: string; description: string }> = {
  1: {
    title: "어떤 여행을 좋아하세요?",
    description: "각 축에서 나에게 더 가까운 단계를 골라 주세요.",
  },
  2: {
    title: "어디에 아끼고, 어디에 투자할까요?",
    description: "항목마다 아끼기와 투자 사이를 조정해 주세요.",
  },
  3: {
    title: "당신의 여행 프로필이 완성됐어요",
    description:
      "취향진단과 가치소비를 하나로 모은 결과예요. 이 기준으로 코스와 혜택을 매칭해 드려요.",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

function getRawStep(searchParams: ReturnType<typeof useSearchParams>) {
  return Number(searchParams.get("step") ?? "1");
}

function getCurrentStep(rawStep: number) {
  return VALID_STEPS.includes(rawStep) ? rawStep : 1;
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getHydratedSnapshot() {
  return true;
}

function getHydratedServerSnapshot() {
  return false;
}

function countAnswered(answers: Record<string, number>) {
  return Object.values(answers).filter((value) => value !== 0).length;
}

function PropensityContent({ userId }: { userId: number | undefined }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reduce = useReducedMotion();
  const [draftAnswers, setDraftAnswers] = useState<typeof INITIAL_ANSWERS | null>(null);
  const [resultOverride, setResultOverride] = useState<PropensityResult | null | undefined>(
    undefined,
  );
  const [isRetaking, setIsRetaking] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    getHydratedSnapshot,
    getHydratedServerSnapshot,
  );
  const storedAnswers = useSyncExternalStore(
    subscribeToStorage,
    () => (userId ? getPropensityAnswers(userId) : null),
    () => null,
  );
  const storedResult = useSyncExternalStore(
    subscribeToStorage,
    () => (userId ? getPropensityResult(userId) : null),
    () => null,
  );
  const answers = draftAnswers ?? storedAnswers ?? INITIAL_ANSWERS;
  const localResult = resultOverride !== undefined ? resultOverride : storedResult;
  const searchParams = useSearchParams();
  const postPropensityMutation = usePostPropensityMutation();
  const postRecommendationsMutation = useMutation({ mutationFn: postRecommendations });
  const propensityResultQuery = useGetPropensityResultQuery(
    isHydrated &&
      !localResult &&
      !isRetaking &&
      [1, 3].includes(getCurrentStep(getRawStep(searchParams))) &&
      !postPropensityMutation.data,
  );

  const rawStep = getRawStep(searchParams);
  const currentStep = getCurrentStep(rawStep);
  const questions = currentStep === 1 || currentStep === 2 ? PROPENSITY_QUESTIONS[currentStep] : [];
  const currentAnswers = currentStep === 1 ? answers.preference : answers.valueConsumption;
  const isPreferenceAnswered = Object.values(answers.preference).every((value) => value !== 0);
  const isAllAnswered =
    isPreferenceAnswered && Object.values(answers.valueConsumption).every((value) => value !== 0);
  const propensityResult =
    postPropensityMutation.data?.propensityResult ??
    propensityResultQuery.data?.propensityResult ??
    localResult ??
    undefined;

  /**
   * 단계 전환 방향. 앞으로 갈 때와 뒤로 갈 때 슬라이드 방향이 다르다 (DESIGN.md §7).
   * 같은 렌더 안에서 방향이 정해져야 exit 애니메이션이 맞으므로,
   * 렌더 중 상태 조정 패턴을 쓴다.
   */
  const [trackedStep, setTrackedStep] = useState(currentStep);
  const [direction, setDirection] = useState(1);
  if (trackedStep !== currentStep) {
    setDirection(currentStep > trackedStep ? 1 : -1);
    setTrackedStep(currentStep);
  }

  const goStep = (step: number) => {
    if (step === 1 || step === 2 || step === 3) {
      router.push(`/propensity?step=${step}`);
    } else {
      router.push("/propensity?step=1");
    }
  };
  const handleChangeAnswer = (questionId: string, answerValue: number) => {
    if (currentStep === 1) {
      setDraftAnswers({
        ...answers,
        preference: { ...answers.preference, [questionId]: answerValue },
      });
      return;
    }
    if (currentStep === 2) {
      setDraftAnswers({
        ...answers,
        valueConsumption: { ...answers.valueConsumption, [questionId]: answerValue },
      });
    }
  };

  useEffect(() => {
    if (propensityResult && userId) {
      savePropensityResult(userId, propensityResult);
    }
  }, [propensityResult, userId]);
  useEffect(() => {
    if (propensityResult && currentStep !== 3 && !isRetaking) {
      router.replace("/propensity?step=3");
    }
  }, [propensityResult, currentStep, isRetaking, router]);
  useEffect(() => {
    if (userId && isHydrated) {
      savePropensityAnswers(userId, answers);
    }
  }, [userId, answers, isHydrated]);

  useEffect(() => {
    if (!VALID_STEPS.includes(rawStep)) {
      router.replace("/propensity?step=1");
    }
  }, [rawStep, router]);

  useEffect(() => {
    if (currentStep === 2 && !isPreferenceAnswered) {
      router.replace("/propensity?step=1");
    }
  }, [currentStep, isPreferenceAnswered, router]);

  const ment = STEP_MENT[currentStep] ?? STEP_MENT[1]!;
  const answeredCount = countAnswered(currentAnswers);
  const submitError = postPropensityMutation.isError
    ? isApiError(postPropensityMutation.error)
      ? postPropensityMutation.error.message
      : "진단 결과 제출 중 오류가 발생했습니다."
    : null;
  const recommendError = postRecommendationsMutation.isError
    ? isApiError(postRecommendationsMutation.error)
      ? postRecommendationsMutation.error.message
      : "코스 추천 생성 중 오류가 발생했습니다."
    : null;

  return (
    <FlowShell
      steps={STEPS}
      currentStep={currentStep}
      showStepLabel
      width="narrow"
      title={ment.title}
      description={ment.description}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          initial={reduce ? undefined : { opacity: 0, x: direction * 20 }}
          animate={reduce ? undefined : { opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.26, ease: EASE }}
          className="border-line bg-surface shadow-card flex w-full flex-col gap-6 rounded-md border px-5 py-6 sm:px-8 sm:py-8"
        >
          {/*
           * 남은 문항 수는 버튼에서만 알린다. 이전에는 여기 우측 상단에 "0 / 5 응답" 을
           * 같이 뒀는데, 버튼의 "N개 문항이 남았어요" 와 같은 내용을 두 번 말하는 셈이었다.
           */}
          {currentStep !== 3 && (
            <PropensityQuestionList
              questions={questions}
              answers={currentAnswers}
              onChangeAnswer={handleChangeAnswer}
            />
          )}

          {currentStep === 3 && (
            <PropensityResultView
              result={propensityResult}
              isError={propensityResultQuery.isError}
              onRetry={() => propensityResultQuery.refetch()}
            />
          )}

          <div className="border-line flex flex-col gap-3 border-t pt-6">
            {currentStep === 1 && (
              <Button
                size="xl"
                className="w-full"
                disabled={!isPreferenceAnswered}
                onClick={() => goStep(2)}
              >
                {isPreferenceAnswered
                  ? "가치소비 설정하기"
                  : `${questions.length - answeredCount}개 문항이 남았어요`}
              </Button>
            )}

            {currentStep === 2 && (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    size="xl"
                    className="sm:flex-1"
                    onClick={() => goStep(1)}
                  >
                    이전 단계
                  </Button>
                  <Button
                    size="xl"
                    className="sm:flex-2"
                    disabled={!isAllAnswered || postPropensityMutation.isPending}
                    onClick={() => {
                      postPropensityMutation.mutate(answers, {
                        onSuccess: (data) => {
                          queryClient.setQueryData(propensityQueryKeys.result(), data);
                          clearPropensityAnswers();
                          setIsRetaking(false);
                          goStep(3);
                        },
                      });
                    }}
                  >
                    {postPropensityMutation.isPending
                      ? "결과를 만들고 있어요..."
                      : isAllAnswered
                        ? "결과 보기"
                        : `${questions.length - answeredCount}개 문항이 남았어요`}
                  </Button>
                </div>
                {submitError && (
                  <p role="alert" className="text-danger-ink text-cap text-center font-medium">
                    {submitError}
                  </p>
                )}
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    size="xl"
                    className="sm:flex-1"
                    onClick={() => {
                      setIsRetaking(true);
                      setDraftAnswers(INITIAL_ANSWERS);
                      clearPropensityAnswers();
                      clearPropensityResult();
                      setResultOverride(null);
                      postPropensityMutation.reset();
                      queryClient.removeQueries({ queryKey: propensityQueryKeys.result() });
                      goStep(1);
                    }}
                  >
                    처음부터 다시
                  </Button>
                  <Button
                    size="xl"
                    className="sm:flex-2"
                    disabled={postRecommendationsMutation.isPending || !propensityResult}
                    onClick={() => {
                      postRecommendationsMutation.mutate(undefined, {
                        onSuccess: () => {
                          router.push("/course-recommend");
                        },
                      });
                    }}
                  >
                    {postRecommendationsMutation.isPending ? "추천 생성 중..." : "코스 추천받기"}
                  </Button>
                </div>
                {recommendError && (
                  <p role="alert" className="text-danger-ink text-cap text-center font-medium">
                    {recommendError}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </FlowShell>
  );
}

export default function Propensity() {
  const { data: user } = useMeQuery();

  return <PropensityContent key={user?.userId} userId={user?.userId} />;
}
