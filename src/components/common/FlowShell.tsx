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
  /**
   * 흐름 화면의 폭.
   * narrow  — 한 가지 일에 집중하는 화면(진단). 5점 척도가 과하게 늘어나지 않는 폭.
   * default — 목록형 흐름 화면.
   * wide    — 목록과 지도처럼 병렬 구성이 들어가는 화면.
   */
  width?: "narrow" | "default" | "wide";
  children: React.ReactNode;
};

export default function FlowShell({
  steps,
  currentStep,
  showStepLabel = false,
  title,
  description,
  align = "center",
  width = "default",
  children,
}: FlowShellProps) {
  return (
    <main className="w-full flex-1 pb-20">
      <div
        className={cn(
          "mx-auto flex w-full flex-col items-center px-4 pt-10 md:px-8 md:pt-14",
          width === "wide" && "max-w-[1280px]",
          width === "default" && "max-w-[62rem]",
          width === "narrow" && "max-w-[48rem]",
        )}
      >
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
