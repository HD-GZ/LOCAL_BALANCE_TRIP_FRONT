"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PropensityQuestionList from "./PropensityQuestionList";
import PropensityStep from "./PropensityStep";

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
      options: [
        { value: "save", label: "아끼기", description: "SAVE" },
        { value: "spend", label: "투자", description: "SPEND" },
      ],
    },
    {
      id: "food",
      title: "음식",
      options: [
        { value: "save", label: "아끼기", description: "SAVE" },
        { value: "spend", label: "투자", description: "SPEND" },
      ],
    },
    {
      id: "experience",
      title: "체험",
      options: [
        { value: "save", label: "아끼기", description: "SAVE" },
        { value: "spend", label: "투자", description: "SPEND" },
      ],
    },
    {
      id: "transportation",
      title: "이동",
      options: [
        { value: "save", label: "아끼기", description: "SAVE" },
        { value: "spend", label: "투자", description: "SPEND" },
      ],
    },
    {
      id: "cafeExhibition",
      title: "카페·전시",
      options: [
        { value: "save", label: "아끼기", description: "SAVE" },
        { value: "spend", label: "투자", description: "SPEND" },
      ],
    },
  ],
};

export default function Propensity() {
  const [answers, setAnswers] = useState({
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
  });
  const router = useRouter();
  const goStep = (step: number) => {
    router.push(`/propensity?step=${step}`);
  };
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? "1");
  const questions = currentStep === 1 || currentStep === 2 ? PROPENSITY_QUESTIONS[currentStep] : [];
  const currentAnswers = currentStep === 1 ? answers.preference : answers.valueConsumption;
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
  return (
    <div className="flex w-full flex-col items-center">
      <PropensityStep currentStep={currentStep} />
      <div className="shadow-[0_1px_2px_0_rgba(40, 36, 28, 0.04), 0_12px_32px_-12px_rgba(40, 36, 28, 0.14)] mt-6 flex w-170 flex-col items-start gap-5.5 rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 pt-7 pb-6">
        <PropensityQuestionList
          questions={questions}
          answers={currentAnswers}
          onChangeAnswer={handleChangeAnswer}
        />
        <div className="flex w-full flex-col items-center self-stretch pt-5">
          {currentStep === 1 && (
            <button
              className="shadow-[0_8px_18px_-10px_rgba(47, 111, 79, 0.55)] cursor-pointer flex h-13.5 w-75 min-w-75 items-center justify-center rounded-[12px] bg-[#2F6F4F] px-5.5 text-white"
              onClick={() => goStep(2)}
            >
              가치소비 설정하기
            </button>
          )}
          {currentStep === 2 && (
            <div className="flex w-full gap-3">
              <button
                className="flex h-12.5 flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-[#C3BDB3] bg-white"
                onClick={() => goStep(1)}
              >
                전으로 돌아가기
              </button>
              <button
                className="shadow-[0_8px_18px_-10px_rgba(47, 111, 79, 0.55)] flex h-12.5 w-75 min-w-75 cursor-pointer items-center justify-center rounded-[12px] bg-[#2F6F4F] px-5.5 text-white"
                onClick={() => goStep(3)}
              >
                결과보기
              </button>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex w-full gap-3">
              <button
                className="flex h-12.5 flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-[#C3BDB3] bg-white"
                onClick={() => goStep(1)}
              >
                처음부터 다시
              </button>
              <button className="shadow-[0_8px_18px_-10px_rgba(47, 111, 79, 0.55)] flex h-12.5 w-75 min-w-75 cursor-pointer items-center justify-center rounded-[12px] bg-[#2F6F4F] px-5.5 text-white">
                코스 추천받기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
