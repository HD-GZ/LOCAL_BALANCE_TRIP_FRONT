import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import type { SavedCourseDetailResponse } from "@/features/recommendation/types";
import CourseStatusBadge from "./CourseStatusBadge";
import SavedCourseDetailTabs from "./SavedCourseDetailTabs";

export default function SavedCourseDetailHeader({
  courseId,
  title,
  status,
}: {
  courseId: number;
  title: string;
  status: SavedCourseDetailResponse["status"];
}) {
  return (
    <div className="flex w-full flex-col items-start">
      <Link
        href="/saved-courses"
        className="flex items-center gap-1.75 text-[13.5px] text-[#5F5B53]"
      >
        <ChevronLeft className="size-4" />
        저장한 코스
      </Link>
      <div className="flex flex-col items-start gap-1.25 pt-5">
        <CourseStatusBadge status={status} />
        <p className="text-[26px] font-semibold tracking-[-0.65px] text-[#222019]">{title}</p>
      </div>
      <div className="pt-5.5">
        <SavedCourseDetailTabs courseId={courseId} />
      </div>
    </div>
  );
}
