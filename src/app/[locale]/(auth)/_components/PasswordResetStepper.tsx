"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/**
 * 비밀번호 찾기 진행 표시. 기존 디자인(develop)의 점 + 라벨 형태.
 * 인증번호 입력/재설정 화면(Client Component)에서도 쓰이므로 Client Component로 둔다.
 */
const PASSWORD_RESET_STEPS = ["email", "verify", "reset"] as const;

export type PasswordResetStep = (typeof PASSWORD_RESET_STEPS)[number];

export default function PasswordResetStepper({
  currentStep,
}: {
  currentStep: PasswordResetStep;
}) {
  const t = useTranslations("stepper.passwordReset");
  const currentIndex = PASSWORD_RESET_STEPS.indexOf(currentStep);

  return (
    <ol aria-label={t("ariaLabel")} className="flex items-center justify-center gap-1">
      {PASSWORD_RESET_STEPS.map((key, index) => {
        const label = t(key);
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li key={key} className="contents">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "rounded-full",
                isCurrent && "bg-brand size-2.5",
                isDone && "bg-brand-line size-2",
                !isCurrent && !isDone && "bg-line-control size-2",
              )}
            >
              <span className="sr-only">{label}</span>
            </span>
            {index < PASSWORD_RESET_STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn("h-0.5 w-2", isDone ? "bg-brand-line" : "bg-line-strong")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
