import { cn } from "@/lib/utils";

/**
 * 회원가입 진행 표시. 기존 디자인(develop)의 점 표시로 되돌렸다 — 팀 합의 사항.
 * 번호가 붙은 공용 Stepper 는 진단·코스 추천처럼 단계 이름이 필요한 흐름에만 쓴다.
 */
const SIGNUP_STEPS = ["signup", "verify-email", "complete"] as const;

type SignupStep = (typeof SIGNUP_STEPS)[number];

export default function SignupStepper({ currentStep }: { currentStep: SignupStep }) {
  const currentIndex = SIGNUP_STEPS.indexOf(currentStep);

  return (
    <ol aria-label="회원가입 진행 단계" className="flex items-center justify-center gap-1">
      {SIGNUP_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li key={step} className="contents">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "rounded-full",
                isCurrent && "bg-brand size-2.5",
                isDone && "bg-brand-line size-2",
                !isCurrent && !isDone && "bg-line-control size-2",
              )}
            >
              <span className="sr-only">{index + 1}단계</span>
            </span>
            {index < SIGNUP_STEPS.length - 1 && (
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
