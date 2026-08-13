"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SavedCourseDetailHeader from "@/app/(main)/saved-courses/[courseId]/SavedCourseDetailHeader";
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
              {reportQuery.isError &&
                (isApiError(reportQuery.error) && reportQuery.error.status === 409 ? (
                  <p className="flex w-full justify-center py-10 text-[13px] text-[#928D84]">
                    아직 리포트가 없어요.
                  </p>
                ) : (
                  <p className="text-[13px] text-red-500">
                    {isApiError(reportQuery.error)
                      ? reportQuery.error.message
                      : "리포트를 불러오는 중 오류가 발생했습니다."}
                  </p>
                ))}
              {report && <ReportSummary report={report} savedCourseId={courseId} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
