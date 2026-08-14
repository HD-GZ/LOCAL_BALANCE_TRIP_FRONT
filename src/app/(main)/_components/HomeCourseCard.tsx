"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import CourseStatusBadge from "@/app/(main)/saved-courses/[courseId]/CourseStatusBadge";
import RouteMarker from "@/assets/routeMarker.svg";
import type { SavedCourseStatus } from "@/features/home/types";
import { cn } from "@/lib/utils";

/**
 * 코스 카드. 기존 디자인(develop)의 표면 처리를 되돌린 것이다 — 팀 합의 사항.
 * 초록 테두리, 위쪽만 물드는 카드 배경, 사진 위에 얹는 배지까지 원래대로 돌렸다.
 * 색과 크기는 토큰을 쓰고, hover 리프트는 남긴다.
 */

type HomeCourseCardProps = {
  href: string;
  title: string;
  imageUrl: string | null;
  /**
   * 저장 코스의 상태. 저장 코스 목록과 같은 배지를 쓰기 위해 상태를 그대로 받는다.
   * 라벨 문자열을 따로 만들면 두 화면의 표시가 어긋난다(팀 피드백).
   */
  status?: SavedCourseStatus | null;
  badge?: { label: string; tone: "outline" | "solid" } | null;
  reason?: string | null;
  meta?: string | null;
};

export default function HomeCourseCard({
  href,
  title,
  imageUrl,
  status,
  badge,
  reason,
  meta,
}: HomeCourseCardProps) {
  const [hasError, setHasError] = useState(false);
  const hasPhoto = Boolean(imageUrl) && !hasError;

  return (
    <Link
      href={href}
      className="lift border-brand-line group flex h-full flex-col overflow-hidden rounded-md border bg-[image:var(--card-gradient)]"
    >
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[image:var(--thumb-gradient)]">
        {hasPhoto && imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20rem"
            className="lift-zoom object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <RouteMarker
            aria-hidden
            className="text-ink-3 absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {status ? (
          <span className="absolute top-2.5 left-2.5">
            <CourseStatusBadge status={status} onPhoto />
          </span>
        ) : (
          badge && (
            <span
              className={cn(
                "text-cap absolute top-2.5 left-2.5 flex h-6.5 items-center rounded-full px-2.75 backdrop-blur-[2px]",
                badge.tone === "solid"
                  ? "bg-brand/92 text-brand-on"
                  : "border-brand-line bg-surface/94 text-brand-ink border",
              )}
            >
              {badge.label}
            </span>
          )
        )}
      </span>

      <span className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
        <span className="text-title-3 text-ink group-hover:text-brand-ink line-clamp-2 transition-colors duration-(--dur-1)">
          {title}
        </span>
        {reason && <span className="text-brand-ink text-body-sm line-clamp-2">{reason}</span>}
        {meta && (
          <span className="text-ink-3 text-cap mt-auto truncate pt-1 font-normal">{meta}</span>
        )}
      </span>
    </Link>
  );
}
