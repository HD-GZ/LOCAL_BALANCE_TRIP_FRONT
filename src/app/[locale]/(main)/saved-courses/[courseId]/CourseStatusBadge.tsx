"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SavedCourseDetailResponse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

/**
 * 저장 코스 상태. 여기서 브릭은 장식이 아니라 "지금 진행 중"이라는 실제 상태를 나타낸다
 * (DESIGN.md §3 — 브릭은 의미 전용).
 */
const STATUS_BADGE: Partial<
  Record<
    SavedCourseDetailResponse["status"],
    { labelKey: "beforeTrip" | "traveling" | "completed"; inline: string; onPhoto: string }
  >
> = {
  BEFORE_TRIP: {
    labelKey: "beforeTrip",
    inline: "border-line-control bg-surface text-ink-2",
    onPhoto: "border-line bg-surface/94 text-ink-2 backdrop-blur-[2px]",
  },
  TRAVELING: {
    labelKey: "traveling",
    inline: "border-danger/40 bg-danger-wash text-danger-ink",
    onPhoto: "bg-danger/92 text-danger-on border-transparent backdrop-blur-[2px]",
  },
  COMPLETED: {
    labelKey: "completed",
    inline: "border-brand/40 bg-brand-wash text-brand-ink",
    onPhoto: "bg-brand/92 text-brand-on border-transparent backdrop-blur-[2px]",
  },
};

export default function CourseStatusBadge({
  status,
  onPhoto = false,
}: {
  status: SavedCourseDetailResponse["status"];
  /** 사진 위에 얹을 때는 채움을 반투명으로 바꿔 사진과 섞이게 한다. */
  onPhoto?: boolean;
}) {
  const t = useTranslations("home.courseStatus");
  const badge = STATUS_BADGE[status];

  if (!badge) {
    return null;
  }

  return (
    <span
      className={cn(
        "text-cap flex h-6.5 w-fit items-center gap-1.5 rounded-full border px-2.75",
        onPhoto ? badge.onPhoto : badge.inline,
      )}
    >
      {status === "COMPLETED" ? (
        <Check className="size-3" strokeWidth={2.25} aria-hidden />
      ) : status === "TRAVELING" ? (
        <span aria-hidden className="size-1.75 rounded-full bg-current" />
      ) : null}
      {t(badge.labelKey)}
    </span>
  );
}
