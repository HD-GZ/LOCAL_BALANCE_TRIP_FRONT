"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

import { COURSE_STEPS } from "@/app/(main)/course-recommend/steps";
import FlowShell from "@/components/common/FlowShell";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { Button } from "@/components/ui/button";
import { saveCourse } from "@/features/recommendation/api";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import CourseBenefitList from "./CourseBenefitList";
import CourseRoute from "./CourseRoute";

function CourseDetailSkeleton() {
  return (
    <div className="border-line bg-surface flex w-full flex-col gap-4 rounded-md border px-5 py-6 sm:px-8">
      <Skeleton className="h-3 w-20" />
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 py-2">
          <Skeleton className="size-7" rounded="full" />
          <Skeleton className="mt-1.5 h-4 w-44" />
        </div>
      ))}
    </div>
  );
}

export default function CourseDetail() {
  const router = useRouter();
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    recommendationQueries.courseDetail(courseId ?? 0, courseId !== null),
  );
  const saveCourseMutation = useMutation({ mutationFn: saveCourse });
  const course = courseDetailQuery.data;

  if (courseId === null) {
    return (
      <FlowShell steps={COURSE_STEPS} currentStep={3} showStepLabel align="start" title="코스 상세">
        <SurfaceState
          tone="error"
          title="잘못된 경로예요"
          description="주소가 올바르지 않아요. 추천 코스 목록에서 다시 선택해 주세요."
          action={{ label: "추천 지역 목록으로", href: "/course-recommend?step=1" }}
        />
      </FlowShell>
    );
  }

  return (
    <FlowShell
      steps={COURSE_STEPS}
      currentStep={3}
      showStepLabel
      align="start"
      width="wide"
      title={course?.title ?? "코스 상세"}
      description={course ? `${course.regionName}에서 이 순서로 돌아보세요.` : undefined}
    >
      {courseDetailQuery.isPending && <CourseDetailSkeleton />}

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
        <div className="border-line bg-surface flex w-full flex-col rounded-md border px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-title-2 text-ink pb-4">코스 순서</h2>
          <CourseRoute places={course.places} />

          <h2 className="text-title-2 text-ink border-line mt-8 border-t pt-8 pb-4">
            이 코스 적용 가능 혜택
          </h2>
          <CourseBenefitList benefits={course.benefits} />

          <div className="border-line mt-6 flex flex-col gap-3 border-t pt-6">
            {saveCourseMutation.isSuccess ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <p className="text-brand-ink text-body-sm flex flex-1 items-center gap-1.5 font-semibold">
                  <Check className="size-4" strokeWidth={2} aria-hidden />
                  코스를 저장했어요
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/saved-courses")}
                  className="sm:w-auto"
                >
                  저장한 코스 보기
                </Button>
              </div>
            ) : (
              <Button
                size="xl"
                className="w-full"
                disabled={saveCourseMutation.isPending}
                onClick={() => saveCourseMutation.mutate(course.courseId)}
              >
                {saveCourseMutation.isPending ? "저장 중..." : "이 코스 저장하기"}
              </Button>
            )}

            {saveCourseMutation.isError && (
              <p role="alert" className="text-danger-ink text-cap text-center font-medium">
                {isApiError(saveCourseMutation.error)
                  ? saveCourseMutation.error.message
                  : "코스 저장 중 오류가 발생했습니다."}
              </p>
            )}
          </div>
        </div>
      )}
    </FlowShell>
  );
}
