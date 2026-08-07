"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SavedCourseDetailHeader from "@/app/(main)/saved-courses/[courseId]/SavedCourseDetailHeader";
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

  if (courseId === null) {
    return (
      <div className="flex w-full flex-col items-center pb-20">
        <p className="mt-9.5 text-[13px] text-red-500">잘못된 경로입니다.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <div className="mt-8.5 flex w-180 flex-col items-center">
        {courseDetailQuery.isError && (
          <p className="mt-9.5 text-[13px] text-red-500">
            {isApiError(courseDetailQuery.error)
              ? courseDetailQuery.error.message
              : "코스 정보를 불러오는 중 오류가 발생했습니다."}
          </p>
        )}
        {course && (
          <>
            <SavedCourseDetailHeader
              courseId={course.savedCourseId}
              title={course.title}
              status={course.status}
            />
            <div className="flex w-full flex-col items-start pt-6.5">
              <p className="pb-3.5 text-[14px] font-semibold tracking-[-0.14px] text-[#222019]">
                저장된 영수증
              </p>
              {receiptsQuery.isError && (
                <p className="text-[13px] text-red-500">
                  {isApiError(receiptsQuery.error)
                    ? receiptsQuery.error.message
                    : "영수증 정보를 불러오는 중 오류가 발생했습니다."}
                </p>
              )}
              {receiptsQuery.data && <ReceiptsList receipts={receiptsQuery.data.receipts} savedCourseId={course.savedCourseId} />}
              <p className="pt-4 text-[13px] text-[#928D84]">
                영수증 촬영·OCR 인식은 앱에서 이용할 수 있어요 · 웹에서는 저장된 증빙 확인·관리만
                지원해요
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
