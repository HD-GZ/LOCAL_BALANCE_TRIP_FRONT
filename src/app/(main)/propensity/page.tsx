"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import { cn } from "@/lib/utils";
import PropensityQuestionList from "./PropensityQuestionList";
import PropensityStep from "./PropensityStep";

const SAVE_SPEND_OPTIONS = [
  { value: "save", label: "아끼기", description: "SAVE" },
  { value: "spend", label: "투자", description: "SPEND" },
];
const INITIAL_ANSWERS = {
  preference: {
    locality: 0,
    frugality: 0,
    experientiality: 0,
    vitality: 0,
    sociality: 0,
  },
  valueConsumption: {
    accommodation: 0,
    food: 0,
    experience: 0,
    transportation: 0,
    cafeExhibition: 0,
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
    {
      id: "accommodation",
      title: "숙소",
      options: SAVE_SPEND_OPTIONS,
    },
    {
      id: "food",
      title: "음식",
      options: SAVE_SPEND_OPTIONS,
    },
    {
      id: "experience",
      title: "체험",
      options: SAVE_SPEND_OPTIONS,
    },
    {
      id: "transportation",
      title: "이동",
      options: SAVE_SPEND_OPTIONS,
    },
    {
      id: "cafeExhibition",
      title: "카페·전시",
      options: SAVE_SPEND_OPTIONS,
    },
  ],
};
const VALID_STEPS = [1, 2, 3];

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
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const propensityType = propensityResult?.type ?? "";

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

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <PropensityStep currentStep={currentStep} />
      <div className="mt-6 flex w-170 flex-col items-start gap-5.5 rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 pt-8 pb-7 shadow-[0_1px_2px_0_rgba(40,36,28,0.04),0_12px_32px_-12px_rgba(40,36,28,0.14)]">
        <PropensityQuestionList
          questions={questions}
          answers={currentAnswers}
          onChangeAnswer={handleChangeAnswer}
        />
        <div className="flex w-full flex-col items-center self-stretch pt-5">
          {currentStep === 1 && (
            <Button
              className={cn(
                "h-13.5 min-w-75 cursor-pointer px-5.5 text-[15.5px] font-semibold",
                !isPreferenceAnswered && "bg-gray-300",
              )}
              disabled={!isPreferenceAnswered}
              onClick={() => goStep(2)}
            >
              가치소비 설정하기
            </Button>
          )}
          {currentStep === 2 && (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full gap-3">
                <Button
                  className="h-12.5 flex-1 border border-[#C3BDB3] bg-white px-5.5 text-[15px] font-semibold text-[#222019] hover:bg-gray-200"
                  onClick={() => goStep(1)}
                >
                  이전 단계
                </Button>
                <Button
                  className={cn(
                    "h-12.5 min-w-75 px-5.5 text-[15.5px] font-semibold",
                    !isAllAnswered && "bg-gray-300",
                  )}
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
                  결과보기
                </Button>
              </div>
              {postPropensityMutation.isError && (
                <p className="self-end text-center text-[12px] text-red-500">
                  {isApiError(postPropensityMutation.error)
                    ? postPropensityMutation.error.message
                    : "진단 결과 제출 중 오류가 발생했습니다."}
                </p>
              )}
            </div>
          )}
          {currentStep === 3 && propensityResult  && (
            <div className="flex w-full flex-col gap-5.5">
              <div className="flex flex-col items-center gap-2 text-center">
                <Image
                  src={propensityResult.imageUrl}
                  alt="Propensity Result"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <span className="text-[29px] leading-[35.96px] font-semibold tracking-[-0.87px] text-[#245A40]">{propensityResult.code}</span>
                <p className="text-[29px] leading-[35.96px] font-semibold tracking-[-0.87px] text-[#222019]">
                  <span className="text-[#245A40]">{propensityType} </span>
                  여행자
                </p>
                <p className="w-115 text-[14.5px] leading-[23.925px] text-[#5F5B53]">
                  {propensityResult.description}
                </p>
              </div>
              <div className="flex w-full gap-2.75">
                <Button
                  className="h-12.5 flex-1 border border-[#C3BDB3] bg-white px-5.5 text-[15px] font-semibold text-[#222019] hover:bg-gray-200"
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
                  className="h-12.5 min-w-75 px-5.5 font-semibold"
                  disabled={postRecommendationsMutation.isPending}
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
              {postRecommendationsMutation.isError && (
                <p className="self-end text-center text-[12px] text-red-500">
                  {isApiError(postRecommendationsMutation.error)
                    ? postRecommendationsMutation.error.message
                    : "코스 추천 생성 중 오류가 발생했습니다."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Propensity() {
  const { data: user } = useMeQuery();

  return <PropensityContent key={user?.userId} userId={user?.userId} />;
}
