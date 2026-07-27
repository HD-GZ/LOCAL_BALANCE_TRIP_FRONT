"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark, Check } from "lucide-react";
import RouteMarker from "@/assets/routeMarker.svg";
import type { SavedCourse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

type SavedCourseCardProps = {
  course: SavedCourse;
};

const STATUS_BADGE: Partial<Record<SavedCourse["status"], { label: string; className: string }>> = {
  TRAVELING: { label: "진행 중", className: "bg-[#B5654A]/92" },
  COMPLETED: { label: "완주", className: "bg-[#2F6F4F]/92" },
};

export default function SavedCourseCard({ course }: SavedCourseCardProps) {
  const [hasError, setHasError] = useState(false);
  const statusBadge = STATUS_BADGE[course.status];

  return (
    <div className="flex flex-col items-start overflow-hidden rounded-[18px] border border-[#EBE7DF] bg-white">
      <div className="relative h-44.25 w-full bg-linear-to-br from-[#E7F0EA] via-[#DFEEE4] to-[#D3E6DA]">
        {course.imageUrl && !hasError ? (
          <Image
            src={course.imageUrl}
            alt={course.courseName}
            fill
            sizes="236px"
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <RouteMarker className="absolute top-1/2 left-1/2 size-11 -translate-x-1/2 -translate-y-1/2" />
        )}
        {statusBadge && (
          <span
            className={cn(
              "absolute top-2.5 left-2.5 flex h-6.5 items-center gap-1.25 rounded-full pr-2.75 pl-2.25 text-[11.5px] font-semibold tracking-[-0.115px] text-white",
              statusBadge.className,
            )}
          >
            {course.status === "COMPLETED" ? (
              <Check className="size-3" />
            ) : (
              <span className="size-1.75 rounded-full bg-white" />
            )}
            {statusBadge.label}
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full border border-[#EBE7DF] bg-white/90 cursor-pointer">
          <Bookmark className="size-4 fill-[#5B7488] text-[#5B7488]" />
        </span>
      </div>
      <p className="w-full px-4 pt-3.75 pb-4.25 text-[15.5px] font-semibold tracking-[-0.31px] text-[#222019]">
        {course.courseName}
      </p>
    </div>
  );
}
