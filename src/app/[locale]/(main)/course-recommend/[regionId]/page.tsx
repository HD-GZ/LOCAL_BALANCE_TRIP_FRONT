"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useCourseSteps } from "@/app/[locale]/(main)/course-recommend/steps";
import FlowShell from "@/components/common/FlowShell";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import RegionCourseList from "./RegionCourseList";

function CourseListSkeleton() {
  return (
    <div className="border-line divide-line flex w-full flex-col divide-y border-y">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="size-16" rounded="md" />
          <span className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-2/3" />
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RegionCourses() {
  const t = useTranslations("courseRecommend.region");
  const tCommon = useTranslations();
  const tApiError = useTranslations("apiError");
  const courseSteps = useCourseSteps();
  const { regionId: regionIdParam } = useParams<{ regionId: string }>();
  const searchParams = useSearchParams();
  const regionName = searchParams.get("regionName") ?? t("fallbackTitle");
  const regionId = parsePositiveIntParam(regionIdParam);
  const coursesQuery = useQuery(
    recommendationQueries.regionCourses(regionId ?? 0, regionId !== null),
  );
  const courses = coursesQuery.data ?? [];

  if (regionId === null) {
    return (
      <FlowShell
        steps={courseSteps}
        currentStep={2}
        showStepLabel
        align="start"
        title={t("fallbackTitle")}
      >
        <SurfaceState
          tone="error"
          title={t("invalidPath.title")}
          description={t("invalidPath.description")}
          action={{ label: t("invalidPath.cta"), href: "/course-recommend?step=1" }}
        />
      </FlowShell>
    );
  }

  return (
    <FlowShell
      steps={courseSteps}
      currentStep={2}
      showStepLabel
      align="start"
      title={regionName}
      description={t("description")}
    >
      {coursesQuery.isPending && <CourseListSkeleton />}

      {coursesQuery.isError && (
        <SurfaceState
          tone="error"
          title={t("error.title")}
          description={
            isApiError(coursesQuery.error)
              ? getApiErrorMessage(coursesQuery.error, tApiError)
              : t("error.description")
          }
          action={{ label: tCommon("retry"), onRetry: () => coursesQuery.refetch() }}
        />
      )}

      {coursesQuery.isSuccess && courses.length === 0 && (
        <SurfaceState
          title={t("empty.title")}
          description={t("empty.description")}
          action={{ label: t("empty.cta"), href: "/course-recommend?step=1" }}
        />
      )}

      {courses.length > 0 && <RegionCourseList courses={courses} />}
    </FlowShell>
  );
}
