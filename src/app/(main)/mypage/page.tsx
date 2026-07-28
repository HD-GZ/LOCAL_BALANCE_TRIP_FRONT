"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import SavedCourseEmpty from "./SavedCourseEmpty";
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

export default function MyPage() {
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
    router.replace(`/mypage?${params.toString()}`);
  };

  const handleStatusChange = (status: TourStatusValue) => {
    updateQuery({ status, page: 1 });
  };

  useEffect(() => {
    if (savedCoursesQuery.data && page > savedCoursesQuery.data.totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(Math.max(1, savedCoursesQuery.data.totalPages)));
      router.replace(`/mypage?${params.toString()}`);
    }
  }, [savedCoursesQuery.data, page, searchParams, router]);

  return (
    <div className="flex w-full items-center justify-center pt-11">
      <div className="flex w-250 flex-col gap-5">
        <div className="flex flex-col gap-4">
          <h1 className="text-[27px] font-semibold tracking-[-0.675px]">저장한 코스</h1>
          <p className="self-stretch text-[15px] leading-6 text-[#5F5B53]">
            코스 추천에서 저장한 코스를 모아봤어요 · GPS 슬로우 투어 시작은 앱에서 할 수 있어요.
          </p>
        </div>
        <main className="flex w-full flex-col items-start gap-7">
          {savedCoursesQuery.isError && (
            <p className="text-[13px] text-red-500">
              {isApiError(savedCoursesQuery.error)
                ? savedCoursesQuery.error.message
                : "저장한 코스를 불러오는 중 오류가 발생했습니다."}
            </p>
          )}
          {!(savedCoursesQuery.isSuccess && totalCount === 0 && selectedStatus === "all") && (
            <div className="flex items-center gap-2">
              {TOUR_STATUS.map((state) => (
                <button
                  key={state.id}
                  className={cn(
                    "flex h-9 cursor-pointer items-center justify-center rounded-[100px] border px-3.75 text-[13.5px] font-medium tracking-[-0.135px]",
                    selectedStatus === state.value
                      ? "border-[#2F6F4F] bg-[#2F6F4F] text-white"
                      : "border-[#EBE7DF] bg-white text-[#5F5853]",
                  )}
                  onClick={() => handleStatusChange(state.value)}
                >
                  {state.title}
                </button>
              ))}
            </div>
          )}
          {savedCoursesQuery.isSuccess && totalCount === 0 && selectedStatus === "all" && (
            <SavedCourseEmpty />
          )}
          {savedCoursesQuery.isSuccess && totalCount === 0 && selectedStatus !== "all" && (
            <p className="flex w-full justify-center text-[13px] text-[#928D84]">
              이 상태의 저장한 코스가 없어요.
            </p>
          )}
          {courses.length > 0 && (
            <SavedCourseList
              courses={courses}
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => updateQuery({ page: nextPage })}
            />
          )}
        </main>
      </div>
    </div>
  );
}
