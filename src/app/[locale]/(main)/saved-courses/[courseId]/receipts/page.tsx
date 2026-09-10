"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import SavedCourseDetailHeader from "@/app/[locale]/(main)/saved-courses/[courseId]/SavedCourseDetailHeader";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { receiptsQueries } from "@/features/receipts/queries";
import { recommendationQueries } from "@/features/recommendation/queries";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import ReceiptsList from "./ReceiptsList";

export default function SavedCourseReceipts() {
  const t = useTranslations("receipts");
  const tApiError = useTranslations("apiError");
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    recommendationQueries.savedCoursesDetail(courseId ?? 0, courseId !== null),
  );
  const receiptsQuery = useQuery(receiptsQueries.receipts(courseId ?? 0, courseId !== null));
  const course = courseDetailQuery.data;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 pt-10 md:px-8 md:pt-14">
        {courseId === null && (
          <SurfaceState
            tone="error"
            title={t("list.invalidRoute.title")}
            description={t("list.invalidRoute.description")}
            action={{ label: t("list.invalidRoute.action"), href: "/saved-courses" }}
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
            title={t("list.courseError.title")}
            description={
              isApiError(courseDetailQuery.error)
                ? getApiErrorMessage(courseDetailQuery.error, tApiError)
                : t("list.courseError.network")
            }
            action={{ label: t("list.courseError.retry"), onRetry: () => courseDetailQuery.refetch() }}
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
              <h2 className="text-title-2 text-ink">{t("list.heading")}</h2>

              {receiptsQuery.isPending && (
                <div className="border-line divide-line flex flex-col divide-y border-y">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="flex items-center gap-3.5 py-3.5">
                      <Skeleton className="size-10" rounded="sm" />
                      <span className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </span>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              )}

              {receiptsQuery.isError && (
                <SurfaceState
                  tone="error"
                  title={t("list.listError.title")}
                  description={
                    isApiError(receiptsQuery.error)
                      ? getApiErrorMessage(receiptsQuery.error, tApiError)
                      : t("list.listError.network")
                  }
                  action={{ label: t("list.listError.retry"), onRetry: () => receiptsQuery.refetch() }}
                />
              )}

              {receiptsQuery.data && (
                <ReceiptsList
                  receipts={receiptsQuery.data.receipts}
                  savedCourseId={course.savedCourseId}
                />
              )}

              <div className="text-ink-3 text-cap flex flex-col font-normal">
                <p>{t("list.note.line1")}</p>
                <p>{t("list.note.line2")}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
