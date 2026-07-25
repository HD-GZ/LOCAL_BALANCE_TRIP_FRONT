"use client";

import { useState } from "react";
import type { SavedCourse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";
import SavedCourseCard from "./SavedCourseCard";
import SavedCoursePager from "./SavedCoursePagenation";

const TOUR_STATUS: StatusProps[] = [
  {
    id: 1,
    value: "all",
    title: "전체",
  },
  {
    id: 2,
    value: "progress",
    title: "진행 중",
  },
  {
    id: 3,
    value: "completed",
    title: "완주",
  },
  {
    id: 4,
    value: "pending",
    title: "미진행",
  },
];
type TourStatusValue = "all" | "progress" | "completed" | "pending";

interface StatusProps {
  id: number;
  value: TourStatusValue;
  title: "전체" | "진행 중" | "완주" | "미진행";
}

type SavedCourseListProps = {
  courses: SavedCourse[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function SavedCourseList({
  courses,
  page,
  totalPages,
  onPageChange,
}: SavedCourseListProps) {
  const [selectedStatus, setSelectedStatus] = useState<TourStatusValue>("all");

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        {TOUR_STATUS.map((state) => (
          <button
            key={state.id}
            className={cn(
              "flex h-9 items-center justify-center rounded-[100px] border px-3.75 text-[13.5px] font-medium tracking-[-0.135px]",
              selectedStatus === state.value
                ? "border-[#2F6F4F] bg-[#2F6F4F] text-white"
                : "border-[#EBE7DF] bg-white text-[#5F5853]",
            )}
            onClick={() => {
              setSelectedStatus(state.value);
            }}
          >
            {state.title}
          </button>
        ))}
      </div>
      <div className="grid w-full grid-cols-4 gap-4.5">
        {courses.map((course) => (
          <SavedCourseCard key={course.savedCourseId} course={course} />
        ))}
      </div>
      <SavedCoursePager page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
