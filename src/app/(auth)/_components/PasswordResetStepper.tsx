import { cn } from "@/lib/utils";

/** 비밀번호 찾기 진행 표시. 기존 디자인(develop)의 점 + 라벨 형태. */
const PASSWORD_RESET_STEPS = [
  { key: "email", label: "이메일 확인" },
  { key: "verify", label: "인증번호 입력" },
  { key: "reset", label: "비밀번호 재설정" },
] as const;

export type PasswordResetStep = (typeof PASSWORD_RESET_STEPS)[number]["key"];

export default function PasswordResetStepper({ currentStep }: { currentStep: PasswordResetStep }) {
  const currentIndex = PASSWORD_RESET_STEPS.findIndex((step) => step.key === currentStep);

  return (
    <ol aria-label="비밀번호 찾기 진행 단계" className="flex items-start justify-center gap-1">
      {PASSWORD_RESET_STEPS.map(({ key, label }, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li key={key} className="contents">
            <div
              aria-current={isCurrent ? "step" : undefined}
              className="flex w-16 flex-col items-center gap-1.5"
            >
              <span
                aria-hidden
                className={cn(
                  "rounded-full",
                  isCurrent && "bg-brand size-2.5",
                  isDone && "bg-brand-line size-2",
                  !isCurrent && !isDone && "bg-line-control size-2",
                )}
              />
              <span
                className={cn(
                  "text-cap whitespace-nowrap",
                  isCurrent ? "text-ink font-semibold" : "text-ink-3 font-normal",
                )}
              >
                {label}
              </span>
            </div>
            {index < PASSWORD_RESET_STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn("mt-1 h-0.5 w-6", isDone ? "bg-brand-line" : "bg-line-strong")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
