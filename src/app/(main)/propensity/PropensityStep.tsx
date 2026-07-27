import Stepper from "@/components/common/Stepper";

const STEPS = ["1", "2", "3"];

const STEP_MENT: Record<number, { title: string; subTitle: string }> = {
  1: {
    title: "어떤 여행을 좋아하세요?",
    subTitle: "각 축에서 나에게 더 가까운 단계를 골라 주세요.",
  },
  2: {
    title: "어디에 아끼고, 어디에 투자할까요?",
    subTitle: "항목마다 아끼기↔투자를 조정해 주세요.",
  },
  3: {
    title: "당신의 여행 프로필이 완성됐어요",
    subTitle:
      "취향진단과 가치소비를 하나로 모은 결과에요. 이 기준으로 코스와 혜택을 매칭해 드려요.",
  },
};

export default function PropensityStep({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-9.5 flex w-full flex-col items-center">
      <Stepper steps={STEPS} currentStep={currentStep} />
      <div className="mt-7.5 flex flex-col gap-2.25">
        <p className="text-center text-[20px] font-semibold text-[#222019]">
          {STEP_MENT[currentStep]?.title}
        </p>
        <p className="text-center text-[14.5px] text-[#5f5B53]">
          {STEP_MENT[currentStep]?.subTitle}
        </p>
      </div>
    </div>
  );
}
