"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

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
import { useRouter } from "@/i18n/navigation";
import { isApiError } from "@/lib/api/error";

import PropensityQuestionList from "./PropensityQuestionList";
import PropensityResultView from "./PropensityResult";

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

/** 문항의 id/value 는 API로 보내는 wire format이므로 번역하지 않는다. label/description만 t()로 만든다. */
function buildPropensityQuestions(t: ReturnType<typeof useTranslations<"propensity">>) {
  const saveSpendOptions = [
    { value: "save", label: t("saveSpendOptions.save"), description: "SAVE" },
    { value: "spend", label: t("saveSpendOptions.spend"), description: "SPEND" },
  ];

  return {
    1: [
      {
        id: "locality",
        title: t("questions.locality.title"),
        options: [
          {
            value: "hotplace",
            label: t("questions.locality.options.hotplace.label"),
            description: t("questions.locality.options.hotplace.description"),
          },
          {
            value: "local",
            label: t("questions.locality.options.local.label"),
            description: t("questions.locality.options.local.description"),
          },
        ],
      },
      {
        id: "frugality",
        title: t("questions.frugality.title"),
        options: [
          {
            value: "luxury",
            label: t("questions.frugality.options.luxury.label"),
            description: t("questions.frugality.options.luxury.description"),
          },
          {
            value: "practical",
            label: t("questions.frugality.options.practical.label"),
            description: t("questions.frugality.options.practical.description"),
          },
        ],
      },
      {
        id: "experientiality",
        title: t("questions.experientiality.title"),
        options: [
          {
            value: "spectator",
            label: t("questions.experientiality.options.spectator.label"),
            description: t("questions.experientiality.options.spectator.description"),
          },
          {
            value: "experience",
            label: t("questions.experientiality.options.experience.label"),
            description: t("questions.experientiality.options.experience.description"),
          },
        ],
      },
      {
        id: "vitality",
        title: t("questions.vitality.title"),
        options: [
          {
            value: "relax",
            label: t("questions.vitality.options.relax.label"),
            description: t("questions.vitality.options.relax.description"),
          },
          {
            value: "active",
            label: t("questions.vitality.options.active.label"),
            description: t("questions.vitality.options.active.description"),
          },
        ],
      },
      {
        id: "sociality",
        title: t("questions.sociality.title"),
        options: [
          {
            value: "solo",
            label: t("questions.sociality.options.solo.label"),
            description: t("questions.sociality.options.solo.description"),
          },
          {
            value: "family",
            label: t("questions.sociality.options.family.label"),
            description: t("questions.sociality.options.family.description"),
          },
        ],
      },
    ],
    2: [
      { id: "accommodation", title: t("questions.accommodation.title"), options: saveSpendOptions },
      { id: "food", title: t("questions.food.title"), options: saveSpendOptions },
      { id: "experience", title: t("questions.experience.title"), options: saveSpendOptions },
      {
        id: "transportation",
        title: t("questions.transportation.title"),
        options: saveSpendOptions,
      },
      {
        id: "cafeExhibition",
        title: t("questions.cafeExhibition.title"),
        options: saveSpendOptions,
      },
    ],
  };
}

const VALID_STEPS = [1, 2, 3];

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

function PropensityContent({ userId }: { userId: number | undefined }) {
  const t = useTranslations("propensity");
  const router = useRouter();
  const queryClient = useQueryClient();
  const reduce = useReducedMotion();
  const PROPENSITY_QUESTIONS = buildPropensityQuestions(t);
  const STEPS = [t("steps.preference"), t("steps.valueConsumption"), t("steps.result")];
  const STEP_MENT: Record<number, { title: string; description: string }> = {
    1: { title: t("stepMent.1.title"), description: t("stepMent.1.description") },
    2: { title: t("stepMent.2.title"), description: t("stepMent.2.description") },
    3: { title: t("stepMent.3.title"), description: t("stepMent.3.description") },
  };
  const searchParams = useSearchParams();
  /** 홈의 "다시 진단하기"처럼 다른 화면에서 곧장 문항 1번으로 보내야 할 때 쓰는 신호다. */
  const isForcedRetake = searchParams.get("retake") === "1";
  const [draftAnswers, setDraftAnswers] = useState<typeof INITIAL_ANSWERS | null>(
    isForcedRetake ? INITIAL_ANSWERS : null,
  );
  const [resultOverride, setResultOverride] = useState<PropensityResult | null | undefined>(
    isForcedRetake ? null : undefined,
  );
  const [isRetaking, setIsRetaking] = useState(isForcedRetake);
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
  const postPropensityMutation = usePostPropensityMutation();
  const postRecommendationsMutation = useMutation({ mutationFn: postRecommendations });

  useEffect(() => {
    if (!isForcedRetake) return;

    clearPropensityAnswers();
    clearPropensityResult();
    postPropensityMutation.reset();
    queryClient.removeQueries({ queryKey: propensityQueryKeys.result() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const ment = STEP_MENT[currentStep] ?? STEP_MENT[1]!;
  const submitError = postPropensityMutation.isError
    ? isApiError(postPropensityMutation.error)
      ? postPropensityMutation.error.message
      : t("errors.submitGeneric")
    : null;
  const recommendError = postRecommendationsMutation.isError
    ? isApiError(postRecommendationsMutation.error)
      ? postRecommendationsMutation.error.message
      : t("errors.recommendGeneric")
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
              <Button size="xl" className="w-full" onClick={() => goStep(2)}>
                {t("buttons.setValueConsumption")}
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
                    {t("buttons.previousStep")}
                  </Button>
                  <Button
                    size="xl"
                    className="sm:flex-2"
                    disabled={postPropensityMutation.isPending}
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
                      ? t("buttons.generatingResult")
                      : t("buttons.seeResult")}
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
                    {t("buttons.startOver")}
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
                    {postRecommendationsMutation.isPending
                      ? t("buttons.generatingRecommendation")
                      : t("buttons.getCourseRecommendation")}
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
