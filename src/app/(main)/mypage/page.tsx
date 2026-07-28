"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import SavedCourseEmpty from "./SavedCourseEmpty";
import SavedCourseList from "./SavedCourseList";

const PAGE_SIZE = 12;

export default function MyPage() {
  const [page, setPage] = useState(1);
  const savedCoursesQuery = useQuery(recommendationQueries.savedCourses(page, PAGE_SIZE));
  const courses = savedCoursesQuery.data?.courses ?? [];
  const totalPages = savedCoursesQuery.data?.totalPages ?? 1;
  const totalCount = savedCoursesQuery.data?.totalCount ?? 0;

  // 마지막 페이지의 마지막 코스를 삭제하면 서버가 돌려주는 totalPages가 줄어들어
  // 지금 보고 있는 page가 범위를 벗어날 가능성 존재. 응답을 받기 전까진 알 수 없어서
  // effect에서 보정한다.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (savedCoursesQuery.data && page > savedCoursesQuery.data.totalPages) {
      setPage(Math.max(1, savedCoursesQuery.data.totalPages));
    }
  }, [savedCoursesQuery.data, page]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="flex w-full items-center justify-center pt-11">
      <div className="flex w-250 flex-col gap-5">
        <div className="flex flex-col gap-4">
          <h1 className="text-[27px] font-semibold tracking-[-0.675px]">저장한 코스</h1>
          <p className="self-stretch text-[15px] leading-6 text-[#5F5B53]">
            코스 추천에서 저장한 코스를 모아봤어요 · GPS 슬로우 투어 시작은 앱에서 할 수 있어요.
          </p>
        </div>
        <main className="flex w-full flex-col items-start">
          {savedCoursesQuery.isError && (
            <p className="text-[13px] text-red-500">
              {isApiError(savedCoursesQuery.error)
                ? savedCoursesQuery.error.message
                : "저장한 코스를 불러오는 중 오류가 발생했습니다."}
            </p>
          )}
          {savedCoursesQuery.isSuccess && totalCount === 0 && <SavedCourseEmpty />}
          {courses.length > 0 && (
            <SavedCourseList
              courses={courses}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
