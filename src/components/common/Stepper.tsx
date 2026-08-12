import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 단계 표시. DESIGN.md §6 (장부 숫자), §7 (상태 전이).
 *
 * 연결선은 지나온 만큼만 올리브로 채운다. 진행이 어디까지 왔는지가 정보이므로
 * 이 채움은 장식이 아니다.
 */

const circleBase =
  "flex size-7 items-center justify-center rounded-full border tabular-nums text-cap transition-colors duration-(--dur-2)";

type StepperProps = {
  steps: string[];
  currentStep: number;
  showStepLabel?: boolean;
};

export default function Stepper({ steps, currentStep, showStepLabel = false }: StepperProps) {
  return (
    <ol className="flex items-start">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCurrent = step === currentStep;
        const isDone = step < currentStep;

        return (
          <li key={step} className="flex items-start">
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "mt-3.5 h-px w-10 transition-colors duration-(--dur-3) sm:w-14",
                  step <= currentStep ? "bg-brand" : "bg-line-control",
                )}
              />
            )}
            <span className="flex flex-col items-center gap-2 px-2">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  circleBase,
                  isCurrent && "border-brand bg-brand text-brand-on",
                  isDone && "border-brand bg-brand-wash text-brand-ink",
                  !isCurrent && !isDone && "border-line-control bg-surface text-ink-3",
                )}
              >
                {isDone ? <CheckIcon className="size-3.5" strokeWidth={2.25} /> : step}
                <span className="sr-only">
                  {isDone ? " 완료" : isCurrent ? " 진행 중" : " 예정"}
                </span>
              </span>
              {showStepLabel && (
                <span
                  className={cn(
                    "text-body-sm whitespace-nowrap transition-colors duration-(--dur-2)",
                    isCurrent ? "text-ink font-semibold" : "text-ink-3 font-medium",
                  )}
                >
                  {label}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
