import Stepper from "@/components/common/Stepper";
import { cn } from "@/lib/utils";

/**
 * 단계형 표면의 공통 골격. 취향 진단과 코스 추천이 같은 리듬을 공유해야
 * 사용자가 "같은 흐름 안에 있다"고 느낀다.
 *
 * 표면 폭은 DESIGN.md §11의 흐름형 기준(42~46rem)을 따른다.
 */

type FlowShellProps = {
  steps: string[];
  currentStep: number;
  showStepLabel?: boolean;
  title: string;
  description?: string;
  /** 제목·설명을 가운데로 (진단) 또는 왼쪽으로 (추천 목록) */
  align?: "center" | "start";
  children: React.ReactNode;
};

export default function FlowShell({
  steps,
  currentStep,
  showStepLabel = false,
  title,
  description,
  align = "center",
  children,
}: FlowShellProps) {
  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[46rem] flex-col items-center px-4 pt-10 md:pt-14">
        <Stepper steps={steps} currentStep={currentStep} showStepLabel={showStepLabel} />

        <div
          className={cn(
            "mt-8 flex w-full flex-col gap-2",
            align === "center" ? "items-center text-center" : "items-start text-left",
          )}
        >
          <h1 className="text-title-1 text-ink sm:text-display-2 text-balance">{title}</h1>
          {description && (
            <p className="text-ink-2 text-body max-w-[54ch] text-pretty">{description}</p>
          )}
        </div>

        <div className="mt-8 w-full">{children}</div>
      </div>
    </main>
  );
}
