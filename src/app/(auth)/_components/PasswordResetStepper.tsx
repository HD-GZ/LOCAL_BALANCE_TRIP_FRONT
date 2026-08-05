import { cn } from "@/lib/utils";

const PASSWORD_RESET_STEPS = [
  { key: "email", label: "이메일 확인" },
  { key: "verify", label: "인증번호 입력" },
  { key: "reset", label: "비밀번호 재설정" },
] as const;

export type PasswordResetStep = (typeof PASSWORD_RESET_STEPS)[number]["key"];

type PasswordResetStepperProps = {
  currentStep: PasswordResetStep;
};

export default function PasswordResetStepper({ currentStep }: PasswordResetStepperProps) {
  const currentStepIndex = PASSWORD_RESET_STEPS.findIndex((step) => step.key === currentStep);

  return (
    <ol
      aria-label="비밀번호 찾기 진행 단계"
      className="mb-6 flex items-start gap-[3.5px] self-center"
    >
      {PASSWORD_RESET_STEPS.map(({ key, label }, stepIndex) => {
        const isCurrent = stepIndex === currentStepIndex;
        const isCompleted = stepIndex < currentStepIndex;

        return (
          <li key={key} className="contents">
            <div
              aria-current={isCurrent ? "step" : undefined}
              className="flex w-16 flex-col items-center gap-1.5"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "rounded-full",
                  isCurrent && "bg-primary size-2.5",
                  isCompleted && "size-2.25 bg-[#C4DDCD]",
                  !isCurrent && !isCompleted && "size-2.25 bg-[#C3BDB3]",
                )}
              />
              <span
                className={cn(
                  "text-[11px] whitespace-nowrap",
                  isCurrent ? "text-foreground font-semibold" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {stepIndex < PASSWORD_RESET_STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={cn("mt-1 h-0.5 w-6", isCompleted ? "bg-[#C4DDCD]" : "bg-[#EBE7DF]")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
