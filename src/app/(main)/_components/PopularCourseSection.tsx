"use client";

import { useQuery } from "@tanstack/react-query";

import Reveal from "@/components/common/Reveal";
import { SkeletonCard } from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";

import HomeCourseCard from "./HomeCourseCard";
import SectionHeader from "./SectionHeader";

export default function PopularCourseSection() {
  const popularCoursesQuery = useQuery(homeQueries.popularCourses());
  const courses = popularCoursesQuery.data?.courses ?? [];

  return (
    <section className="flex w-full flex-col gap-5">
      <SectionHeader
        title="요즘 인기 있는 로컬 코스"
        description="진단을 마치면 내 취향에 맞춘 코스와 저장 목록이 이 자리에 표시돼요."
        moreHref="/course-recommend?step=1"
      />

      {popularCoursesQuery.isPending && (
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {popularCoursesQuery.isError && (
        <SurfaceState
          tone="error"
          title="인기 코스를 불러오지 못했어요"
          description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
          action={{ label: "다시 시도", onRetry: () => popularCoursesQuery.refetch() }}
        />
      )}

      {popularCoursesQuery.isSuccess && courses.length === 0 && (
        <SurfaceState
          variant="plain"
          title="지금 보여드릴 인기 코스가 없어요"
          description="취향 진단을 마치면 내 기준에 맞는 코스를 바로 추천해 드려요."
          action={{ label: "취향 진단 시작하기", href: "/propensity?step=1" }}
        />
      )}

      {courses.length > 0 && (
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <Reveal as="li" key={course.courseId} index={index}>
              <HomeCourseCard
                href={`/course-recommend/courses/${course.courseId}`}
                title={course.title}
                imageUrl={course.imageUrl}
                badge={{ label: "인기 지역", tone: "outline" }}
                reason={course.reason}
                meta={course.regionName}
              />
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
