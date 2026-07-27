"use client";

import { useState } from "react";
import type { SavedCourse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";
import SavedCourseCard from "./SavedCourseCard";
import SavedCoursePager from "./SavedCoursePager";

const TOUR_STATUS: StatusProps[] = [
  {
    id: 1,
    value: "all",
    title: "전체",
  },
  {
    id: 2,
    value: "progress",
    title: "여행 중",
  },
  {
    id: 3,
    value: "completed",
    title: "완주",
  },
  {
    id: 4,
    value: "before",
    title: "여행전",
  },
];
type TourStatusValue = "all" | "progress" | "completed" | "before";

interface StatusProps {
  id: number;
  value: TourStatusValue;
  title: "전체" | "여행 중" | "완주" | "여행전";
}

const STATUS_FILTER_MAP: Record<Exclude<TourStatusValue, "all">, SavedCourse["status"]> = {
  before: "BEFORE_TRIP",
  progress: "TRAVELING",
  completed: "COMPLETED",
};

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
  const filteredCourses =
    selectedStatus === "all"
      ? courses
      : courses.filter((course) => course.status === STATUS_FILTER_MAP[selectedStatus]);

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        {TOUR_STATUS.map((state) => (
          <button
            key={state.id}
            className={cn(
              "flex h-9 items-center justify-center rounded-[100px] border px-3.75 text-[13.5px] font-medium tracking-[-0.135px] cursor-pointer",
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
      {filteredCourses.length === 0 ? (
        <p className="text-[13px] text-[#928D84] w-full justify-center flex">이 상태의 저장한 코스가 없어요.</p>
      ) : (
        <>
        <div className="grid w-full grid-cols-4 gap-4.5">
          {filteredCourses.map((course) => (
            <SavedCourseCard key={course.savedCourseId} course={course} />
          ))}
        </div>
        <SavedCoursePager page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}
