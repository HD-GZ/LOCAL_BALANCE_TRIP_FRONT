"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import SavedCourseDetailHeader from "@/app/[locale]/(main)/saved-courses/[courseId]/SavedCourseDetailHeader";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { ReportQueries } from "@/features/reports/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import ReportSummary from "./ReportSummary";

export default function SavedCourseReport() {
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    recommendationQueries.savedCoursesDetail(courseId ?? 0, courseId !== null),
  );
  const reportQuery = useQuery({
    ...ReportQueries(courseId ?? 0).report(),
    enabled: courseId !== null,
  });
  const course = courseDetailQuery.data;
  const report = reportQuery.data;
  /** 완주 전에는 리포트가 없다. 오류가 아니라 아직 이른 상태이므로 그렇게 알린다. */
  const isReportPending = isApiError(reportQuery.error) && reportQuery.error.status === 409;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-10 md:px-8 md:pt-14">
        {courseId === null && (
          <SurfaceState
            tone="error"
            title="잘못된 경로예요"
            description="주소가 올바르지 않아요. 저장한 코스 목록에서 다시 선택해 주세요."
            action={{ label: "저장한 코스로", href: "/saved-courses" }}
          />
        )}

        {courseId !== null && courseDetailQuery.isPending && (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-48" />
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
            <SavedCourseDetailHeader
              courseId={course.savedCourseId}
              title={course.title}
              regionName={course.regionName}
              status={course.status}
            />

            <div className="border-line bg-surface shadow-card flex w-full flex-col gap-4 rounded-md border px-5 py-6 sm:px-8 sm:py-8">
              <h2 className="text-title-2 text-ink">완주 리포트</h2>

              {reportQuery.isPending && (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-37.5 w-full" rounded="md" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-13 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
              )}

              {reportQuery.isError &&
                (isReportPending ? (
                  <SurfaceState
                    variant="plain"
                    title="아직 리포트가 없어요"
                    description="코스를 완주하면 걸은 거리와 지역 소비를 정리해 드려요."
                  />
                ) : (
                  <SurfaceState
                    tone="error"
                    title="리포트를 불러오지 못했어요"
                    description={
                      isApiError(reportQuery.error)
                        ? reportQuery.error.message
                        : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
                    }
                    action={{ label: "다시 시도", onRetry: () => reportQuery.refetch() }}
                  />
                ))}

              {report && (
                <div className="mx-auto w-full max-w-180">
                  <ReportSummary report={report} savedCourseId={course.savedCourseId} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
