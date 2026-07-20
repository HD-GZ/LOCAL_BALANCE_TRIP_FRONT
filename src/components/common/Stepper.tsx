import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const stepCircleClassName =
  "border-[1.5px] flex size-6.25 items-center justify-center rounded-full border font-mono text-[11.5px] font-semibold";

type StepperProps = {
  steps: string[];
  currentStep: number;
  showStepLabel?: boolean;
};

export default function Stepper({ steps, currentStep, showStepLabel = false }: StepperProps) {
  return (
    <div className="flex items-center gap-3.5">
      {steps.map((label, index) => {
        const step = index + 1;
        return (
          <div key={step} className="flex items-center gap-3.5">
            {index > 0 && <span className="h-[1.5px] w-11.5 bg-[#D9D5CD]" />}
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  stepCircleClassName,
                  step === currentStep
                    ? "border-[#2F6F4F] bg-[#2F6F4F] text-white shadow-[0_0_0_4px_#E7F0EA]"
                    : step < currentStep
                      ? "border-[#C4DDCD] bg-[#E7F0EA]"
                      : "border-[#C3BDB3] text-[#928D84]",
                )}
              >
                {step < currentStep ? <CheckIcon className="size-3.5 stroke-[#2F6F4F]" /> : step}
              </span>
              {showStepLabel && (
                <span
                  className={cn(
                    "text-[13.5px] tracking-[-0.135px]",
                    step === currentStep ? "font-semibold text-[#222019]" : "font-medium text-[#928D84]",
                  )}
                >
                  {label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
