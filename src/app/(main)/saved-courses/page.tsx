"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import PageShell from "@/components/common/PageShell";
import { SkeletonCard } from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";

import SavedCourseList from "./SavedCourseList";
import { STATUS_FILTER_MAP, TOUR_STATUS, type TourStatusValue } from "./tourStatus";

const PAGE_SIZE = 12;

function getPageParam(searchParams: ReturnType<typeof useSearchParams>) {
  const raw = Number(searchParams.get("page") ?? "1");
  return Number.isInteger(raw) && raw > 0 ? raw : 1;
}

function getStatusParam(searchParams: ReturnType<typeof useSearchParams>): TourStatusValue {
  const raw = searchParams.get("status");
  return TOUR_STATUS.some((state) => state.value === raw) ? (raw as TourStatusValue) : "all";
}

export default function SavedCourses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = getPageParam(searchParams);
  const selectedStatus = getStatusParam(searchParams);
  const statusParam = selectedStatus === "all" ? undefined : STATUS_FILTER_MAP[selectedStatus];
  const savedCoursesQuery = useQuery(
    recommendationQueries.savedCourses(page, PAGE_SIZE, statusParam),
  );
  const courses = savedCoursesQuery.data?.courses ?? [];
  const totalPages = savedCoursesQuery.data?.totalPages ?? 1;
  const totalCount = savedCoursesQuery.data?.totalCount ?? 0;

  const updateQuery = (next: { page?: number; status?: TourStatusValue }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.page !== undefined) params.set("page", String(next.page));
    if (next.status !== undefined) {
      if (next.status === "all") {
        params.delete("status");
      } else {
        params.set("status", next.status);
      }
    }
    router.replace(`/saved-courses?${params.toString()}`);
  };

  useEffect(() => {
    if (
      savedCoursesQuery.data &&
      savedCoursesQuery.data.totalPages > 0 &&
      page > savedCoursesQuery.data.totalPages
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(savedCoursesQuery.data.totalPages));
      router.replace(`/saved-courses?${params.toString()}`);
    }
  }, [savedCoursesQuery.data, page, searchParams, router]);

  const isFullyEmpty = savedCoursesQuery.isSuccess && totalCount === 0 && selectedStatus === "all";

  return (
    <PageShell
      title="저장한 코스"
      description={[
        "코스 추천에서 저장한 코스를 모아봤어요.",
        "GPS 슬로우 투어 시작은 앱에서 할 수 있어요.",
      ]}
    >
      {savedCoursesQuery.isError && (
        <SurfaceState
          tone="error"
          title="저장한 코스를 불러오지 못했어요"
          description={
            isApiError(savedCoursesQuery.error)
              ? savedCoursesQuery.error.message
              : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
          }
          action={{ label: "다시 시도", onRetry: () => savedCoursesQuery.refetch() }}
        />
      )}

      {!isFullyEmpty && !savedCoursesQuery.isError && (
        <div className="flex flex-wrap gap-2">
          {TOUR_STATUS.map((state) => {
            const isSelected = selectedStatus === state.value;

            return (
              <button
                key={state.id}
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  "press text-body-sm flex h-9 cursor-pointer items-center rounded-full border px-4 font-semibold",
                  isSelected
                    ? "border-brand bg-brand text-brand-on"
                    : "border-line-control text-ink-2 hover:border-ink-3 hover:text-ink bg-transparent",
                )}
                onClick={() => updateQuery({ status: state.value, page: 1 })}
              >
                {state.title}
              </button>
            );
          })}
        </div>
      )}

      {savedCoursesQuery.isPending && (
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {isFullyEmpty && (
        <SurfaceState
          title="아직 저장한 코스가 없어요"
          description="코스 추천에서 마음에 드는 코스를 저장하면 여기에 모여요."
          action={{ label: "코스 추천 보러 가기", href: "/course-recommend?step=1" }}
        />
      )}

      {savedCoursesQuery.isSuccess && totalCount === 0 && selectedStatus !== "all" && (
        <SurfaceState
          title="이 상태의 저장한 코스가 없어요"
          description="다른 상태 필터를 눌러 확인해 보세요."
          action={{ label: "전체 보기", href: "/saved-courses" }}
        />
      )}

      {courses.length > 0 && (
        <SavedCourseList
          courses={courses}
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => updateQuery({ page: nextPage })}
        />
      )}
    </PageShell>
  );
}
