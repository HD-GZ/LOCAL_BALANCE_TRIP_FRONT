"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import Reveal from "@/components/common/Reveal";
import { SkeletonCard } from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";

import HomeCourseCard from "./HomeCourseCard";
import SectionHeader from "./SectionHeader";

export default function PopularCourseSection() {
  const t = useTranslations("home.popularCourse");
  const tCommon = useTranslations();
  const popularCoursesQuery = useQuery(homeQueries.popularCourses());
  const courses = popularCoursesQuery.data?.courses ?? [];

  return (
    <section className="flex w-full flex-col gap-5">
      <SectionHeader title={t("title")} moreHref="/course-recommend?step=1" />

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
          title={t("error.title")}
          description={t("error.description")}
          action={{ label: tCommon("retry"), onRetry: () => popularCoursesQuery.refetch() }}
        />
      )}

      {popularCoursesQuery.isSuccess && courses.length === 0 && (
        <SurfaceState
          variant="plain"
          title={t("empty.title")}
          description={t("empty.description")}
          action={{ label: t("empty.cta"), href: "/propensity?step=1" }}
        />
      )}

      {courses.length > 0 && (
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <Reveal as="li" key={course.courseId} index={index}>
              <HomeCourseCard
                href={`/home/popular-courses/${course.courseId}`}
                title={course.title}
                imageUrl={course.imageUrl}
                badge={{ label: t("badgeLabel"), tone: "outline" }}
                reason={course.reason}
              />
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
