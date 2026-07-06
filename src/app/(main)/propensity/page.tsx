"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePostPropensityMutation } from "@/features/propensity/queries";
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

function PropensityContent() {
  const router = useRouter();
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const searchParams = useSearchParams();
  const postPropensityMutation = usePostPropensityMutation();

  const rawStep = Number(searchParams.get("step") ?? "1");
  const currentStep = VALID_STEPS.includes(rawStep) ? rawStep : 1;
  const questions = currentStep === 1 || currentStep === 2 ? PROPENSITY_QUESTIONS[currentStep] : [];
  const currentAnswers = currentStep === 1 ? answers.preference : answers.valueConsumption;
  const isAllAnswered = Object.values(answers).every((group) =>
    Object.values(group).every((value) => value !== 0),
  );
  const propensityType = postPropensityMutation.data?.propensityResult.type ?? "";
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
    if (!VALID_STEPS.includes(rawStep)) {
      router.replace("/propensity?step=1");
    }
  }, [rawStep, router]);

  return (
    <div className="flex w-full flex-col items-center">
      <PropensityStep currentStep={currentStep} />
      <div className="shadow-[0_1px_2px_0_rgba(40,36,28,0.04),0_12px_32px_-12px_rgba(40,36,28,0.14)] mt-6 flex w-170 flex-col items-start gap-5.5 rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 pt-7 pb-6">
        <PropensityQuestionList
          questions={questions}
          answers={currentAnswers}
          onChangeAnswer={handleChangeAnswer}
        />
        <div className="flex w-full flex-col items-center self-stretch pt-5">
          {currentStep === 1 && (
            <Button className="h-13.5 min-w-75 text-[15.5px]" onClick={() => goStep(2)}>
              가치소비 설정하기
            </Button>
          )}
          {currentStep === 2 && (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full gap-3">
                <Button
                  className="h-12.5 flex-1 border border-[#C3BDB3] bg-white text-[#222019] hover:bg-gray-200"
                  onClick={() => goStep(1)}
                >
                  전으로 돌아가기
                </Button>
                <Button
                  className={cn("h-12.5 min-w-75 text-[15.5px]", !isAllAnswered && "bg-gray-300")}
                  disabled={!isAllAnswered || postPropensityMutation.isPending}
                  onClick={() => {
                    postPropensityMutation.mutate(answers, {
                      onSuccess: () => goStep(3),
                    });
                  }}
                >
                  결과보기
                </Button>
              </div>
              {postPropensityMutation.isError && (
                <p className="text-center text-[12px] text-red-500 self-end">
                  {isApiError(postPropensityMutation.error)
                    ? postPropensityMutation.error.message
                    : "진단 결과 제출 중 오류가 발생했습니다."}
                </p>
              )}
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-[29px] font-semibold text-[#222019] leading-[35.96px] tracking-[-0.87px]">
                  <span className="text-[#245A40]">{typePrefix}</span>
                  여행자
                </p>
                <p className="w-115 text-[14.5px] text-[#5F5B53] leading-[23.925px]">
                  {postPropensityMutation.data?.propensityResult.description}
                </p>
              </div>
              <div className="flex w-full gap-3">
                <Button
                  className="h-12.5 flex-1 border border-[#C3BDB3] bg-white text-[#222019] hover:bg-gray-200"
                  onClick={() => {
                    setAnswers(INITIAL_ANSWERS);
                    postPropensityMutation.reset();
                    goStep(1);
                  }}
                >
                  처음부터 다시
                </Button>
                <Button className="h-12.5 min-w-75">코스 추천받기</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Propensity() {
  return (
    <Suspense>
      <PropensityContent />
    </Suspense>
  );
}
