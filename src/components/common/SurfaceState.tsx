import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 빈 상태 / 오류 상태. DESIGN.md §8.
 *
 * 텍스트 한 줄로 끝내지 않는다. 빈 상태는 왜 비었는지와 채우는 방법을,
 * 오류 상태는 무슨 일인지와 다시 시도할 방법을 함께 준다.
 */

type SurfaceStateProps = {
  title: string;
  /** 왜 이 상태인지, 또는 무엇을 하면 되는지 */
  description?: string;
  tone?: "empty" | "error";
  action?: { label: string; href: string } | { label: string; onRetry: () => void };
  className?: string;
};

export default function SurfaceState({
  title,
  description,
  tone = "empty",
  action,
  className,
}: SurfaceStateProps) {
  const isError = tone === "error";

  return (
    <div
      role={isError ? "alert" : undefined}
      className={cn(
        "border-line flex w-full flex-col items-center gap-2 rounded-md border border-dashed px-6 py-12 text-center",
        isError ? "bg-danger-wash/50" : "bg-surface-2/60",
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
