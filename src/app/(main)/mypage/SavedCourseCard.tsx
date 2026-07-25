"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import RouteMarker from "@/assets/routeMarker.svg";
import type { SavedCourse } from "@/features/recommendation/types";

type SavedCourseCardProps = {
  course: SavedCourse;
};

export default function SavedCourseCard({ course }: SavedCourseCardProps) {
  const [hasError, setHasError] = useState(false);

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
        <span className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full border border-[#EBE7DF] bg-white/90">
          <Bookmark className="size-4 fill-[#5B7488] text-[#5B7488]" />
        </span>
      </div>
      <p className="w-full px-4 pt-3.75 pb-4.25 text-[15.5px] font-semibold tracking-[-0.31px] text-[#222019]">
        {course.courseName}
      </p>
    </div>
  );
}
