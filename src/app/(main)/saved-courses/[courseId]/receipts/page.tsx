"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import SavedCourseDetailHeader from "@/app/(main)/saved-courses/[courseId]/SavedCourseDetailHeader";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { receiptsQueries } from "@/features/receipts/queries";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import ReceiptsList from "./ReceiptsList";

export default function SavedCourseReceipts() {
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    recommendationQueries.savedCoursesDetail(courseId ?? 0, courseId !== null),
  );
  const receiptsQuery = useQuery(receiptsQueries.receipts(courseId ?? 0, courseId !== null));
  const course = courseDetailQuery.data;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-8 px-4 pt-10 md:pt-14">
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

            <div className="flex w-full flex-col gap-4">
              <h2 className="text-title-2 text-ink">저장된 영수증</h2>

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
                  title="영수증 정보를 불러오지 못했어요"
                  description={
                    isApiError(receiptsQuery.error)
                      ? receiptsQuery.error.message
                      : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
                  }
                  action={{ label: "다시 시도", onRetry: () => receiptsQuery.refetch() }}
                />
              )}

              {receiptsQuery.data && (
                <ReceiptsList
                  receipts={receiptsQuery.data.receipts}
                  savedCourseId={course.savedCourseId}
                />
              )}

              <p className="text-ink-3 text-cap font-normal">
                영수증 촬영과 OCR 인식은 앱에서 이용할 수 있어요. 웹에서는 저장된 증빙 확인과 관리만
                지원해요.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
