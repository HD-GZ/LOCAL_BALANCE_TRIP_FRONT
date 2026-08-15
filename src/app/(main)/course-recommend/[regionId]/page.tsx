"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { COURSE_STEPS } from "@/app/(main)/course-recommend/steps";
import FlowShell from "@/components/common/FlowShell";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import RegionCourseList from "./RegionCourseList";

function CourseListSkeleton() {
  return (
    <div className="border-line divide-line flex w-full flex-col divide-y border-y">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="size-16" rounded="md" />
          <span className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-2/3" />
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RegionCourses() {
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
      <FlowShell steps={COURSE_STEPS} currentStep={2} showStepLabel align="start" title="추천 코스">
        <SurfaceState
          tone="error"
          title="잘못된 경로예요"
          description="주소가 올바르지 않아요. 추천 지역 목록에서 다시 선택해 주세요."
          action={{ label: "추천 지역 목록으로", href: "/course-recommend?step=1" }}
        />
      </FlowShell>
    );
  }

  return (
    <FlowShell
      steps={COURSE_STEPS}
      currentStep={2}
      showStepLabel
      align="start"
      title={regionName}
      description="가장 잘 맞는 추천 코스예요. 코스를 누르면 동선과 오디오, 혜택을 볼 수 있어요."
    >
      {coursesQuery.isPending && <CourseListSkeleton />}

      {coursesQuery.isError && (
        <SurfaceState
          tone="error"
          title="추천 코스를 불러오지 못했어요"
          description={
            isApiError(coursesQuery.error)
              ? coursesQuery.error.message
              : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
          }
          action={{ label: "다시 시도", onRetry: () => coursesQuery.refetch() }}
        />
      )}

      {coursesQuery.isSuccess && courses.length === 0 && (
        <SurfaceState
          title="이 지역에 추천된 코스가 없어요"
          description="다른 추천 지역에는 코스가 준비돼 있을 수 있어요."
          action={{ label: "다른 지역 보기", href: "/course-recommend?step=1" }}
        />
      )}

      {courses.length > 0 && <RegionCourseList courses={courses} />}
    </FlowShell>
  );
}
