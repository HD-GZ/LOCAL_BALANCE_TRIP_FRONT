"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { receiptsQueries } from "@/features/receipts/queries";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";
import ReceiptDetailContent from "./ReceiptDetailContent";

export default function ReceiptDetail() {
  const { courseId: courseIdParam, receiptId: receiptIdParam } = useParams<{
    courseId: string;
    receiptId: string;
  }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const receiptId = parsePositiveIntParam(receiptIdParam);

  const courseDetailQuery = useQuery(
    recommendationQueries.savedCoursesDetail(courseId ?? 0, courseId !== null),
  );
  const receiptDetailQuery = useQuery(
    receiptsQueries.receiptsDetail(courseId ?? 0, receiptId ?? 0, courseId !== null && receiptId !== null),
  );

  const course = courseDetailQuery.data;
  const receipt = receiptDetailQuery.data;

  if (courseId === null || receiptId === null) {
    return (
      <div className="flex w-full flex-col items-center pb-20">
        <p className="mt-9.5 text-[13px] text-red-500">잘못된 경로입니다.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <div className="mt-8.5 flex w-225 flex-col items-start">
        {(courseDetailQuery.isError || receiptDetailQuery.isError) && (
          <p className="text-[13px] text-red-500">
            {isApiError(courseDetailQuery.error)
              ? courseDetailQuery.error.message
              : isApiError(receiptDetailQuery.error)
                ? receiptDetailQuery.error.message
                : "증빙 정보를 불러오는 중 오류가 발생했습니다."}
          </p>
        )}
        {course && receipt && (
          <ReceiptDetailContent
            course={course}
            receipt={receipt}
            courseId={courseId}
            receiptId={receiptId}
          />
        )}
      </div>
    </div>
  );
}
