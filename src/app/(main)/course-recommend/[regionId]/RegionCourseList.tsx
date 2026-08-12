"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ThumbImage from "@/components/common/ThumbImage";
import type { RecommendedCourse } from "@/features/recommendation/types";

type RegionCourseListProps = {
  courses: RecommendedCourse[];
};

export default function RegionCourseList({ courses }: RegionCourseListProps) {
  return (
    <ol className="border-line divide-line flex w-full flex-col divide-y border-y">
      {courses.map((course, index) => (
        <li key={course.courseId}>
          <Link
            href={`/course-recommend/courses/${course.courseId}`}
            className="group hover:bg-surface-2 -mx-3 flex items-center gap-4 rounded-sm px-3 py-4 transition-colors duration-(--dur-1)"
          >
            <span className="text-ink-3 text-num w-6 shrink-0 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <ThumbImage src={course.imageUrl} alt="" className="size-16" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-title-2 text-ink group-hover:text-brand-ink transition-colors duration-(--dur-1)">
                {course.title}
              </span>
              <span className="text-ink-2 text-body-sm line-clamp-2">{course.reason}</span>
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
