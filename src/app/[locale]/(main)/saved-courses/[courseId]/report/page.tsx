"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import SavedCourseDetailHeader from "@/app/[locale]/(main)/saved-courses/[courseId]/SavedCourseDetailHeader";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { ReportQueries } from "@/features/reports/queries";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import ReportSummary from "./ReportSummary";

export default function SavedCourseReport() {
  const t = useTranslations("report");
  const tApiError = useTranslations("apiError");
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
            title={t("page.invalidRoute.title")}
            description={t("page.invalidRoute.description")}
            action={{ label: t("page.invalidRoute.action"), href: "/saved-courses" }}
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
            title={t("page.courseError.title")}
            description={
              isApiError(courseDetailQuery.error)
                ? getApiErrorMessage(courseDetailQuery.error, tApiError)
                : t("page.courseError.network")
            }
            action={{ label: t("page.courseError.retry"), onRetry: () => courseDetailQuery.refetch() }}
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
              <h2 className="text-title-2 text-ink">{t("page.heading")}</h2>

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
                    title={t("page.notYet.title")}
                    description={t("page.notYet.description")}
                  />
                ) : (
                  <SurfaceState
                    tone="error"
                    title={t("page.error.title")}
                    description={
                      isApiError(reportQuery.error)
                        ? getApiErrorMessage(reportQuery.error, tApiError)
                        : t("page.error.network")
                    }
                    action={{ label: t("page.error.retry"), onRetry: () => reportQuery.refetch() }}
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
