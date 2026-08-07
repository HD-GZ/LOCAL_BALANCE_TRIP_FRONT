"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CourseBenefitList from "@/app/(main)/course-recommend/courses/[courseId]/CourseBenefitList";
import CourseTimeline from "@/app/(main)/course-recommend/courses/[courseId]/CourseTimeline";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";
import SavedCourseDetailHeader from "./SavedCourseDetailHeader";

export default function SavedCourseDetail() {
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    recommendationQueries.savedCoursesDetail(courseId ?? 0, courseId !== null),
  );
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
                코스 순서
              </p>
              <CourseTimeline places={course.places} />
              <div className="flex w-full flex-col items-center py-7.5">
                <span className="h-px w-full bg-[#EBE7DF]" />
              </div>
              <p className="pb-3.5 text-[16px] font-semibold tracking-[-0.24px] text-[#222019]">
                이 코스 적용 가능 혜택
              </p>
              <CourseBenefitList benefits={course.benefits} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
