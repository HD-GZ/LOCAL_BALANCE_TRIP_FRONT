"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CourseRecommendStep from "@/app/(main)/course-recommend/CourseRecommendStep";
import { useGetRegionCoursesQuery } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import RegionCourseList from "./RegionCourseList";

function RegionCoursesContent() {
  const currentStep = 2;
  const { regionId } = useParams<{ regionId: string }>();
  const searchParams = useSearchParams();
  const regionName = searchParams.get("regionName") ?? "추천 코스";
  const coursesQuery = useGetRegionCoursesQuery(Number(regionId));
  const courses = coursesQuery.data ?? [];

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <div className="mt-9.5 flex w-170 flex-col items-center gap-6.5">
        <CourseRecommendStep currentStep={currentStep} />
        <div className="flex w-full flex-col items-start gap-2.25">
          <p className="text-[27px] font-semibold tracking-[-0.675px] text-[#222019]">
            {regionName}
          </p>
          <p className="text-[15px] text-[#5F5B53]">
            가장 잘 맞는 추천 코스예요 · 코스를 누르면 동선·오디오·혜택을 볼 수 있어요
          </p>
        </div>
        {coursesQuery.isError && (
          <p className="text-[13px] text-red-500">
            {isApiError(coursesQuery.error)
              ? coursesQuery.error.message
              : "추천 코스를 불러오는 중 오류가 발생했습니다."}
          </p>
        )}
        {coursesQuery.isSuccess && courses.length === 0 && (
          <p className="text-[13px] text-[#928D84]">이 지역에 추천된 코스가 없어요.</p>
        )}
        {courses.length > 0 && <RegionCourseList courses={courses} />}
      </div>
    </div>
  );
}

export default function RegionCourses() {
  return (
    <Suspense>
      <RegionCoursesContent />
    </Suspense>
  );
}
