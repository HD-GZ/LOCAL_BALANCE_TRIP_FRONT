"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import CourseRecommendStep from "@/app/(main)/course-recommend/CourseRecommendStep";
import { Button } from "@/components/ui/button";
import { saveCourse } from "@/features/recommendation/api";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";
import CourseBenefitList from "./CourseBenefitList";
import CourseTimeline from "./CourseTimeline";

export default function CourseDetail() {
  const currentStep = 3;
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(recommendationQueries.courseDetail(courseId ?? 0, courseId !== null));
  const saveCourseMutation = useMutation({ mutationFn: saveCourse });
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
      <div className="mt-9.5 flex w-170 flex-col items-center gap-6.5">
        <CourseRecommendStep currentStep={currentStep} />
        <p className="w-full text-[27px] font-semibold tracking-[-0.675px] text-[#222019]">
          {course?.title ?? "코스 상세"}
        </p>
        {courseDetailQuery.isError && (
          <p className="text-[13px] text-red-500">
            {isApiError(courseDetailQuery.error)
              ? courseDetailQuery.error.message
              : "코스 정보를 불러오는 중 오류가 발생했습니다."}
          </p>
        )}
        {course && (
          <div className="flex w-full flex-col items-start rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 pt-6.5 pb-7.5 shadow-[0_1px_2px_0_rgba(40,36,32,0.04),0_12px_32px_-12px_rgba(40,36,32,0.1)]">
            <p className="pb-3.5 text-[14px] font-semibold tracking-[-0.14px] text-[#222019]">
              코스 순서
            </p>
            <CourseTimeline places={course.places} />
            <div className="flex w-full flex-col items-center py-8">
              <span className="h-px w-full bg-[#EBE7DF]" />
            </div>
            <p className="pb-3.5 text-[16px] font-semibold tracking-[-0.24px] text-[#222019]">
              이 코스 적용 가능 혜택
            </p>
            <CourseBenefitList benefits={course.benefits} />
            <div className="flex w-full flex-col items-center gap-2 pt-7.5">
              <Button
                className="h-13 w-80 text-[15.5px] font-semibold shadow-[0_8px_18px_-10px_rgba(47,111,79,0.4)]"
                disabled={saveCourseMutation.isPending}
                onClick={() => saveCourseMutation.mutate(course.courseId)}
              >
                {saveCourseMutation.isPending ? "저장 중..." : "저장"}
              </Button>
              {saveCourseMutation.isError && (
                <p className="text-[12px] text-red-500">
                  {isApiError(saveCourseMutation.error)
                    ? saveCourseMutation.error.message
                    : "코스 저장 중 오류가 발생했습니다."}
                </p>
              )}
              {saveCourseMutation.isSuccess && (
                <p className="text-[12px] text-[#2F6F4F]">코스를 저장했어요.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
