"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import RouteMarker from "@/assets/routeMarker.svg";
import { cn } from "@/lib/utils";

/**
 * 코스 카드. DESIGN.md §6 규칙 4 — 배지를 사진 위에 얹지 않고 사진 아래로 내렸다.
 * hover 는 리프트 + 이미지 확대. 그림자를 켜지 않는다 (§7).
 */

type HomeCourseCardProps = {
  href: string;
  title: string;
  imageUrl: string | null;
  badge?: { label: string; tone: "outline" | "solid" } | null;
  reason?: string | null;
  meta?: string | null;
};

export default function HomeCourseCard({
  href,
  title,
  imageUrl,
  badge,
  reason,
  meta,
}: HomeCourseCardProps) {
  const [hasError, setHasError] = useState(false);
  const hasPhoto = Boolean(imageUrl) && !hasError;

  return (
    <Link
      href={href}
      className="lift border-line bg-surface group flex h-full flex-col overflow-hidden rounded-md border"
    >
      <span className="bg-paper-sunk relative block aspect-[4/3] w-full overflow-hidden">
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
      </span>

      <span className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-5">
        {badge && (
          <span
            className={cn(
              "text-cap w-fit rounded-xs px-2 py-0.5",
              badge.tone === "solid"
                ? "bg-brand text-brand-on"
                : "border-line-control text-ink-2 border",
            )}
          >
            {badge.label}
          </span>
        )}
        <span className="text-title-3 text-ink group-hover:text-brand-ink line-clamp-2 transition-colors duration-(--dur-1)">
          {title}
        </span>
        {reason && <span className="text-ink-2 text-body-sm line-clamp-2">{reason}</span>}
        {meta && (
          <span className="text-ink-3 text-cap mt-auto truncate pt-1 font-normal">{meta}</span>
        )}
      </span>
    </Link>
  );
}
