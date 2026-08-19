"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import CourseBenefitList from "@/app/[locale]/(main)/course-recommend/courses/[courseId]/CourseBenefitList";
import CourseRoute from "@/app/[locale]/(main)/course-recommend/courses/[courseId]/CourseRoute";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import PopularCourseDetailHeader from "./PopularCourseDetailHeader";

export default function PopularCourseDetail() {
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    homeQueries.popularCourseDetail(courseId ?? 0, courseId !== null),
  );
  const course = courseDetailQuery.data;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 pt-10 md:pt-14">
        {courseId === null && (
          <SurfaceState
            tone="error"
            title="잘못된 경로예요"
            description="주소가 올바르지 않아요. 홈에서 다시 선택해 주세요."
            action={{ label: "홈으로", href: "/" }}
          />
        )}

        {courseId !== null && courseDetailQuery.isPending && (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-48" />
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="size-7" rounded="full" />
                <Skeleton className="mt-1.5 h-4 w-40" />
              </div>
            ))}
          </div>
        )}

        {courseDetailQuery.isError && (
          <SurfaceState
            tone="error"
            title="코스 정보를 불러오지 못했어요"
            description={
              isApiError(courseDetailQuery.error)
                ? courseDetailQuery.error.message
                : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
            }
            action={{ label: "다시 시도", onRetry: () => courseDetailQuery.refetch() }}
          />
        )}

        {course && (
          <>
            <PopularCourseDetailHeader title={course.title} regionName={course.regionName} />
            <div className="border-line bg-surface shadow-card flex w-full flex-col rounded-md border px-5 py-6 sm:px-8 sm:py-8">
              <h2 className="text-title-2 text-ink pb-4">코스 순서</h2>
              <CourseRoute places={course.places} />

              <h2 className="text-title-2 text-ink border-line mt-8 border-t pt-8 pb-4">
                이 코스 적용 가능 혜택
              </h2>
              <CourseBenefitList benefits={course.benefits} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
