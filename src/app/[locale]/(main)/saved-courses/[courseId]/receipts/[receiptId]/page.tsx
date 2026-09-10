"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { receiptsQueries } from "@/features/receipts/queries";
import { recommendationQueries } from "@/features/recommendation/queries";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import ReceiptDetailContent from "./ReceiptDetailContent";

export default function ReceiptDetail() {
  const t = useTranslations("receipts");
  const tApiError = useTranslations("apiError");
  const { courseId: courseIdParam, receiptId: receiptIdParam } = useParams<{
    courseId: string;
    receiptId: string;
  }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const receiptId = parsePositiveIntParam(receiptIdParam);
  const isValidRoute = courseId !== null && receiptId !== null;

  const courseDetailQuery = useQuery(
    recommendationQueries.savedCoursesDetail(courseId ?? 0, courseId !== null),
  );
  const receiptDetailQuery = useQuery(
    receiptsQueries.receiptsDetail(courseId ?? 0, receiptId ?? 0, isValidRoute),
  );

  const course = courseDetailQuery.data;
  const receipt = receiptDetailQuery.data;
  const isPending = courseDetailQuery.isPending || receiptDetailQuery.isPending;
  const hasError = courseDetailQuery.isError || receiptDetailQuery.isError;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 pt-10 md:px-8 md:pt-14">
        {!isValidRoute && (
          <SurfaceState
            tone="error"
            title={t("detail.invalidRoute.title")}
            description={t("detail.invalidRoute.description")}
            action={{ label: t("detail.invalidRoute.action"), href: "/saved-courses" }}
          />
        )}

        {isValidRoute && isPending && !hasError && (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-8 w-40" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
              <Skeleton className="aspect-3/4 w-full" rounded="md" />
              <div className="flex flex-col gap-3">
                <Skeleton className="h-40 w-full" rounded="md" />
                <Skeleton className="h-12 w-full" rounded="sm" />
              </div>
            </div>
          </div>
        )}

        {hasError && (
          <SurfaceState
            tone="error"
            title={t("detail.error.title")}
            description={
              isApiError(courseDetailQuery.error)
                ? getApiErrorMessage(courseDetailQuery.error, tApiError)
                : isApiError(receiptDetailQuery.error)
                  ? getApiErrorMessage(receiptDetailQuery.error, tApiError)
                  : t("detail.error.network")
            }
            action={{
              label: t("detail.error.retry"),
              onRetry: () => {
                courseDetailQuery.refetch();
                receiptDetailQuery.refetch();
              },
            }}
          />
        )}

        {course && receipt && courseId !== null && receiptId !== null && (
          <ReceiptDetailContent
            course={course}
            receipt={receipt}
            courseId={courseId}
            receiptId={receiptId}
          />
        )}
      </div>
    </main>
  );
}
