"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CourseRecommendStep from "@/app/(main)/course-recommend/CourseRecommendStep";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";
import RegionCourseList from "./RegionCourseList";

export default function RegionCourses() {
  const currentStep = 2;
  const { regionId: regionIdParam } = useParams<{ regionId: string }>();
  const searchParams = useSearchParams();
  const regionName = searchParams.get("regionName") ?? "추천 코스";
  const regionId = parsePositiveIntParam(regionIdParam);
  const coursesQuery = useQuery(
    recommendationQueries.regionCourses(regionId ?? 0, regionId !== null),
  );
  const courses = coursesQuery.data ?? [];

  if (regionId === null) {
    return (
      <div className="flex w-full flex-col items-center pb-20">
        <p className="mt-9.5 text-[13px] text-red-500">잘못된 경로입니다.</p>
      </div>
    );
  }

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
