"use client";

import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/features/home/queries";
import HomeCourseCard from "./HomeCourseCard";
import HomeSectionState from "./HomeSectionState";
import SectionHeader from "./SectionHeader";

export default function PopularCourseSection() {
  const popularCoursesQuery = useQuery(homeQueries.popularCourses());
  const courses = popularCoursesQuery.data?.courses ?? [];

  return (
    <section className="flex w-full flex-col gap-4.25">
      <SectionHeader
        title="요즘 인기 있는 로컬 코스"
        description="진단을 마치면 내 취향에 맞춘 코스와 저장 목록이 이 자리에 표시돼요"
        moreHref="/course-recommend?step=1"
      />
      {popularCoursesQuery.isPending && <HomeSectionState message="인기 코스를 불러오는 중..." />}
      {popularCoursesQuery.isError && (
        <HomeSectionState message="인기 코스를 불러오지 못했어요." tone="error" />
      )}
      {popularCoursesQuery.isSuccess && courses.length === 0 && (
        <HomeSectionState message="지금 보여드릴 인기 코스가 없어요." />
      )}
      {courses.length > 0 && (
        <div className="grid w-full grid-cols-4 gap-4">
          {courses.map((course) => (
            <HomeCourseCard
              key={course.courseId}
              href={`/course-recommend/courses/${course.courseId}`}
              title={course.title}
              imageUrl={course.imageUrl}
              badge={{ label: "인기 지역", tone: "outline" }}
              reason={course.reason}
              meta={course.regionName}
            />
          ))}
        </div>
      )}
    </section>
  );
}
