import { cn } from "@/lib/utils";

/**
 * 로딩 표시. DESIGN.md §7, §8.
 *
 * 원형 스피너를 쓰지 않는다. 스켈레톤은 최종 레이아웃의 형태를 그대로 가져야
 * 하므로 여기서는 조각(Skeleton)만 제공하고, 배치는 각 표면이 자기 레이아웃을
 * 복제해 조립한다.
 */

export default function Skeleton({
  className,
  rounded = "sm",
}: {
  className?: string;
  /** "none" 은 아치처럼 className 으로 형태를 직접 줄 때 쓴다. */
  rounded?: "xs" | "sm" | "md" | "full" | "none";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-paper-sunk block motion-safe:animate-pulse",
        rounded === "xs" && "rounded-xs",
        rounded === "sm" && "rounded-sm",
        rounded === "md" && "rounded-md",
        rounded === "full" && "rounded-full",
        className,
      )}
    />
  );
}

/** 텍스트 한 줄. 마지막 줄은 짧게 해 실제 문단처럼 보이게 한다. */
export function SkeletonText({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <span className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 && lines > 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </span>
  );
}

/** 코스·지역 카드 자리. HomeCourseCard 와 같은 골격을 유지한다. */
export function SkeletonCard() {
  return (
    <div className="border-line bg-surface flex flex-col overflow-hidden rounded-md border">
      <Skeleton className="aspect-[4/3] w-full" rounded="xs" />
      <span className="flex flex-col gap-2.5 px-4 pt-4 pb-5">
        <Skeleton className="h-4 w-3/4" />
        <SkeletonText lines={2} />
      </span>
    </div>
  );
}
