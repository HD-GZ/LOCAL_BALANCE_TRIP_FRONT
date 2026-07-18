"use client";

import { useRouter } from "next/navigation";
import ChevronRight from "@/assets/chevronRight.svg";
import ThumbImage from "@/components/common/ThumbImage";
import type { RecommendedCourse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

type RegionCourseListProps = {
  courses: RecommendedCourse[];
};

export default function RegionCourseList({ courses }: RegionCourseListProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 py-2 shadow-[0_1px_2px_0_rgba(40,36,32,0.04),0_12px_32px_-12px_rgba(40,36,32,0.1)]">
      {courses.map((course, index) => (
        <button
          key={course.courseId}
          type="button"
          onClick={() => router.push(`/course-recommend/courses/${course.courseId}`)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-4 py-4.5",
            index > 0 && "border-t border-t-[#EBE7DF]",
          )}
        >
          <ThumbImage src={course.imageUrl} alt={course.title} />
          <div className="flex flex-1 flex-col items-start gap-1.25 text-left">
            <p className="text-[17.5px] font-semibold tracking-[-0.35px] text-[#222019]">
              {course.title}
            </p>
            <p className="text-[13.5px] text-[#5F5B53]">{course.reason}</p>
          </div>
          <ChevronRight className="size-4.5 shrink-0" />
        </button>
      ))}
    </div>
  );
}
