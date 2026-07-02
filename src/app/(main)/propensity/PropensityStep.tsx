import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const stepClassName =
  "border-1.5 flex size-6.25 items-center justify-center rounded-full border font-mono text-[11.5px] font-semibold flex items-center justify-center";

const STEP_MENT = [
  {
    step: 1,
    title: "어떤 여행을 좋아하세요?",
    subTitle: "각 축에서 나에게 더 가까운 단계를 골라 주세요.",
  },
  {
    step: 2,
    title: "어디에 아끼고, 어디에 투자할까요?",
    subTitle: "항목마다 아끼기↔투자를 조정해 주세요.",
  },
  {
    step: 3,
    title: "당신의 여행 프로필이 완성됐어요",
    subTitle:
      "취향진단과 가치소비를 하나로 모은 결과에요. 이 기준으로 코스와 혜택을 매칭해 드려요.",
  },
];

export default function PropensityStep({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-9.5 flex w-full flex-col items-center">
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            stepClassName,
            currentStep == 1
              ? "border-[#2F6F4F] bg-[#2F6F4F] text-white shadow-[0_0_0_4px_#E7F0EA]"
              : "border-[#C4DDCD] bg-[#E7F0EA]",
          )}
        >
          {currentStep == 1 ? 1 : <CheckIcon className="size-3.5 stroke-[#2F6F4F]" />}
        </span>
        <span className="h-[1.5px] w-11.5 bg-[#D9D5CD]"></span>
        <span
          className={cn(
            stepClassName,
            currentStep == 2
              ? "border-[#2F6F4F] bg-[#2F6F4F] text-white shadow-[0_0_0_4px_#E7F0EA]"
              : currentStep < 2
                ? "border-[#C3BDB3] text-[#928D84]"
                : "border-[#C4DDCD] bg-[#E7F0EA]",
          )}
        >
          {currentStep == 2 || currentStep < 2 ? (
            2
          ) : (
            <CheckIcon className="size-3.5 stroke-[#2F6F4F]" />
          )}
        </span>
        <span className="h-[1.5px] w-11.5 bg-[#D9D5CD]"></span>
        <span
          className={cn(
            stepClassName,
            currentStep == 3
              ? "border-[#2F6F4F] bg-[#2F6F4F] text-white shadow-[0_0_0_4px_#E7F0EA]"
              : "border-[#C3BDB3] text-[#928D84]",
          )}
        >
          3
        </span>
      </div>
      <div className="mt-7.5 flex flex-col gap-2.25">
        <p className="text-center text-[20px] font-semibold text-[#222019]">
          {STEP_MENT[currentStep - 1]?.title}
        </p>
        <p className="text-center text-[14.5px] text-[#5f5B53]">
          {STEP_MENT[currentStep - 1]?.subTitle}
        </p>
      </div>
    </div>
  );
}
