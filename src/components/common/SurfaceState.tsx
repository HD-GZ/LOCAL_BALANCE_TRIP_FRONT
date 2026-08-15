import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 빈 상태 / 오류 상태.
 *
 * 텍스트 한 줄로 끝내지 않는다. 빈 상태는 왜 비었는지와 채우는 방법을,
 * 오류 상태는 무슨 일인지와 다시 시도할 방법을 함께 준다.
 *
 * 테두리 처리는 기존 디자인을 따른다 — 팀 합의 사항.
 * 섹션 안의 빈 상태는 박스 없이 문구만(variant="plain"), 화면 전체가 비었거나
 * 오류일 때는 박스로 감싼다. 오류는 재시도 버튼을 담아야 하므로 영역이 필요하다.
 */

type SurfaceStateProps = {
  title: string;
  /** 왜 이 상태인지, 또는 무엇을 하면 되는지 */
  description?: string;
  tone?: "empty" | "error";
  /** plain 은 박스 없이 문구만. 섹션 안에 들어가는 빈 상태에 쓴다. */
  variant?: "boxed" | "plain";
  action?: { label: string; href: string } | { label: string; onRetry: () => void };
  className?: string;
};

export default function SurfaceState({
  title,
  description,
  tone = "empty",
  variant = "boxed",
  action,
  className,
}: SurfaceStateProps) {
  const isError = tone === "error";
  // 오류는 항상 박스로 감싼다. 재시도 버튼이 놓일 자리가 필요하다.
  const isBoxed = variant === "boxed" || isError;

  return (
    <div
      role={isError ? "alert" : undefined}
      className={cn(
        "flex w-full flex-col items-center gap-2 text-center",
        isBoxed
          ? cn(
              "border-line rounded-md border px-6 py-12",
              isError ? "bg-danger-wash/50" : "bg-surface/50",
            )
          : "py-10",
        className,
      )}
    >
      <p className={cn("text-title-3", isError ? "text-danger-ink" : "text-ink")}>{title}</p>
      {description && <p className="text-ink-2 text-body-sm max-w-[42ch]">{description}</p>}
      {action &&
        ("href" in action ? (
          <Link
            href={action.href}
            className="text-brand-ink text-body-sm hover:decoration-brand-ink mt-2 inline-flex items-center gap-1 font-semibold decoration-transparent underline-offset-4 transition-colors duration-(--dur-1) hover:underline"
          >
            {action.label}
            <ArrowRight className="size-3.5" strokeWidth={1.75} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onRetry}
            className="press border-line-control text-ink text-body-sm hover:bg-surface-2 mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1.5 font-semibold"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} />
            {action.label}
          </button>
        ))}
    </div>
  );
}
