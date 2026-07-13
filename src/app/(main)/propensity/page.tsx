"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  usePostPropensityMutation,
  useGetPropensityResultQuery,
} from "@/features/propensity/queries";
import {
  clearPropensityAnswers,
  getPropensityAnswers,
  savePropensityAnswers,
} from "@/features/propensity/storage";
import { useMeQuery } from "@/features/user/queries";
import { isApiError } from "@/lib/api";
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

function PropensityContent({ userId }: { userId: number | undefined }) {
  const router = useRouter();
  const [answers, setAnswers] = useState(
    () => (userId ? getPropensityAnswers(userId) : null) ?? INITIAL_ANSWERS,
  );
  const searchParams = useSearchParams();
  const postPropensityMutation = usePostPropensityMutation();
  const propensityResultQuery = useGetPropensityResultQuery(
    searchParams.get("step") === "3" && !postPropensityMutation.data,
  );

  const rawStep = Number(searchParams.get("step") ?? "1");
  const currentStep = VALID_STEPS.includes(rawStep) ? rawStep : 1;
  const questions = currentStep === 1 || currentStep === 2 ? PROPENSITY_QUESTIONS[currentStep] : [];
  const currentAnswers = currentStep === 1 ? answers.preference : answers.valueConsumption;
  const isPreferenceAnswered = Object.values(answers.preference).every((value) => value !== 0);
  const isAllAnswered =
    isPreferenceAnswered && Object.values(answers.valueConsumption).every((value) => value !== 0);
  const propensityResult =
    postPropensityMutation.data?.propensityResult ?? propensityResultQuery.data?.propensityResult;
  const propensityType = propensityResult?.type ?? "";
  const typePrefix = propensityType.replace(/여행자\s*$/, "");

  const goStep = (step: number) => {
    if (step === 1 || step === 2 || step === 3) {
      router.push(`/propensity?step=${step}`);
    } else {
      router.push("/propensity?step=1");
    }
  };
  const handleChangeAnswer = (questionId: string, answerValue: number) => {
    setAnswers((prev) => {
      if (currentStep === 1) {
        return {
          ...prev,
          preference: {
            ...prev.preference,
            [questionId]: answerValue,
          },
        };
      }
      if (currentStep === 2) {
        return {
          ...prev,
          valueConsumption: {
            ...prev.valueConsumption,
            [questionId]: answerValue,
          },
        };
      }
      return prev;
    });
  };

  useEffect(() => {
    if (userId) {
      savePropensityAnswers(userId, answers);
    }
  }, [userId, answers]);

  useEffect(() => {
    if (!VALID_STEPS.includes(rawStep)) {
      router.replace("/propensity?step=1");
    }
  }, [rawStep, router]);

  return (
    <div className="flex w-full flex-col items-center">
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
                "h-13.5 min-w-75 px-5.5 text-[15.5px] font-semibold cursor-pointer",
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
                      onSuccess: () => {
                        clearPropensityAnswers();
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
          {currentStep === 3 && (
            <div className="flex w-full flex-col gap-5.5">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-[29px] leading-[35.96px] font-semibold tracking-[-0.87px] text-[#222019]">
                  <span className="text-[#245A40]">{typePrefix}</span>
                  여행자
                </p>
                <p className="w-115 text-[14.5px] leading-[23.925px] text-[#5F5B53]">
                  {propensityResult?.description}
                </p>
              </div>
              <div className="flex w-full gap-2.75">
                <Button
                  className="h-12.5 flex-1 border border-[#C3BDB3] bg-white px-5.5 text-[15px] font-semibold text-[#222019] hover:bg-gray-200"
                  onClick={() => {
                    setAnswers(INITIAL_ANSWERS);
                    clearPropensityAnswers();
                    postPropensityMutation.reset();
                    goStep(1);
                  }}
                >
                  처음부터 다시
                </Button>
                <Button className="h-12.5 min-w-75 px-5.5 font-semibold">코스 추천받기</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Propensity() {
  const { data: user } = useMeQuery();

  return (
    <Suspense>
      <PropensityContent key={user?.userId} userId={user?.userId} />
    </Suspense>
  );
}
