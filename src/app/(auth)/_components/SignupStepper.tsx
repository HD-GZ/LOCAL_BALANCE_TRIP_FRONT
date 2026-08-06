import { cn } from "@/lib/utils";

const SIGNUP_STEPS = ["signup", "verify-email", "complete"] as const;

type SignupStep = (typeof SIGNUP_STEPS)[number];

type SignupStepperProps = {
  currentStep: SignupStep;
};

export default function SignupStepper({ currentStep }: SignupStepperProps) {
  const currentStepIndex = SIGNUP_STEPS.indexOf(currentStep);

  return (
    <ol aria-label="회원가입 진행 단계" className="mb-6 flex items-center gap-[3.5px] self-center">
      {SIGNUP_STEPS.map((step, stepIndex) => {
        const isCurrent = stepIndex === currentStepIndex;
        const isCompleted = stepIndex < currentStepIndex;
        const isConnectorCompleted = stepIndex < currentStepIndex;

        return (
          <li key={step} className="contents">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "rounded-full",
                isCurrent && "bg-primary size-2.5",
                isCompleted && "size-2.25 bg-[#C4DDCD]",
                !isCurrent && !isCompleted && "size-2.25 bg-[#C3BDB3]",
              )}
            >
              <span className="sr-only">{stepIndex + 1}단계</span>
            </span>
            {stepIndex < SIGNUP_STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={cn("h-0.5 w-2", isConnectorCompleted ? "bg-[#C4DDCD]" : "bg-[#EBE7DF]")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
