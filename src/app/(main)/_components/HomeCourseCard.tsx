"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RouteMarker from "@/assets/routeMarker.svg";
import { cn } from "@/lib/utils";

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

  return (
    <Link
      href={href}
      aria-label={title}
      className="flex flex-col items-start overflow-hidden rounded-[18px] border border-[#C4DDCD] bg-linear-to-b from-[#F4FAF6] to-white to-46%"
    >
      <div className="relative h-[190.5px] w-full bg-linear-[150deg,#E7F0EA_0%,#DFEEE4_55%,#D3E6DA_100%]">
        {imageUrl && !hasError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="254px"
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <RouteMarker className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2" />
        )}
        {badge && (
          <span
            className={cn(
              "absolute top-2.5 left-2.5 flex h-6.25 items-center rounded-full px-2.75 text-[11.5px] font-semibold",
              badge.tone === "outline"
                ? "border border-[#C4DDCD] bg-white/94 text-[#1C4631] backdrop-blur-[2px]"
                : "bg-[#2F6F4F]/92 text-white backdrop-blur-[2px]",
            )}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col gap-1.5 px-4 pt-3.25 pb-4.25">
        <p className="truncate text-[15.5px] font-semibold tracking-[-0.31px] text-[#222019]">
          {title}
        </p>
        {reason && <p className="line-clamp-2 text-[12.5px] text-[#2F6F4F]">{reason}</p>}
        {meta && <p className="truncate text-[11px] text-[#928D84]">{meta}</p>}
      </div>
    </Link>
  );
}
