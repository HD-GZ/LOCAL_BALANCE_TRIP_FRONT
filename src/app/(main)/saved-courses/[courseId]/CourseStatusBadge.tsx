import { Check } from "lucide-react";

import type { SavedCourseDetailResponse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

/**
 * 저장 코스 상태. 여기서 브릭은 장식이 아니라 "지금 진행 중"이라는 실제 상태를 나타낸다
 * (DESIGN.md §3 — 브릭은 의미 전용).
 */
const STATUS_BADGE: Partial<
  Record<SavedCourseDetailResponse["status"], { label: string; className: string }>
> = {
  BEFORE_TRIP: {
    label: "여행 전",
    className: "border-line-control text-ink-2",
  },
  TRAVELING: {
    label: "여행 중",
    className: "border-danger/40 bg-danger-wash text-danger-ink",
  },
  COMPLETED: {
    label: "완주",
    className: "border-brand/40 bg-brand-wash text-brand-ink",
  },
};

export default function CourseStatusBadge({
  status,
}: {
  status: SavedCourseDetailResponse["status"];
}) {
  const badge = STATUS_BADGE[status];

  if (!badge) {
    return null;
  }

  return (
    <span
      className={cn(
        "text-cap flex h-6 w-fit items-center gap-1.5 rounded-xs border px-2",
        badge.className,
      )}
    >
      {status === "COMPLETED" && <Check className="size-3" strokeWidth={2.25} aria-hidden />}
      {badge.label}
    </span>
  );
}
