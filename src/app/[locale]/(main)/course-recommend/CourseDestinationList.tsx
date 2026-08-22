"use client";

import { ArrowRight } from "lucide-react";

import ThumbImage from "@/components/common/ThumbImage";
import type { RecommendedRegion } from "@/features/recommendation/types";
import { Link } from "@/i18n/navigation";

/**
 * 추천 지역 목록. 카드 그리드가 아니라 괘선으로 나뉜 행이다 — 순위가 있는 목록이고,
 * 스캔이 목적이기 때문이다 (DESIGN.md §6 규칙 3).
 *
 * 이전 구현은 button + router.push 였다. Link 로 바꿔 새 탭 열기와 키보드 탐색이 동작한다.
 */

type CourseDestinationListProps = {
  destinations: RecommendedRegion[];
};

export default function CourseDestinationList({ destinations }: CourseDestinationListProps) {
  return (
    <ol className="border-line bg-surface shadow-card divide-line flex w-full flex-col divide-y rounded-md border px-6">
      {destinations.map((destination, index) => (
        <li key={destination.regionId}>
          <Link
            href={`/course-recommend/${destination.regionId}?regionName=${encodeURIComponent(destination.regionName)}`}
            className="group flex items-center gap-4 py-4 transition-colors duration-(--dur-1)"
          >
            <span className="text-ink-3 text-num w-6 shrink-0 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <ThumbImage src={destination.imageUrl} alt="" className="size-16" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-title-2 text-ink group-hover:text-brand-ink transition-colors duration-(--dur-1)">
                {destination.regionName}
              </span>
              <span className="text-ink-2 text-body-sm line-clamp-2">{destination.reason}</span>
            </span>
            <ArrowRight
              aria-hidden
              className="text-ink-3 group-hover:text-brand-ink size-4 shrink-0 transition-all duration-(--dur-2) group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
