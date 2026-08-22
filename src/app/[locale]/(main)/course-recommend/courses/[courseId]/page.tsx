"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCourseSteps } from "@/app/[locale]/(main)/course-recommend/steps";
import FlowShell from "@/components/common/FlowShell";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { Button } from "@/components/ui/button";
import { saveCourse } from "@/features/recommendation/api";
import { recommendationQueries } from "@/features/recommendation/queries";
import { useRouter } from "@/i18n/navigation";
import { isApiError } from "@/lib/api/error";
import { parsePositiveIntParam } from "@/lib/utils";

import CourseBenefitList from "./CourseBenefitList";
import CourseRoute from "./CourseRoute";

function CourseDetailSkeleton() {
  return (
    <div className="border-line bg-surface shadow-card flex w-full flex-col gap-4 rounded-md border px-5 py-6 sm:px-8">
      <Skeleton className="h-3 w-20" />
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 py-2">
          <Skeleton className="size-7" rounded="full" />
          <Skeleton className="mt-1.5 h-4 w-44" />
        </div>
      ))}
    </div>
  );
}

export default function CourseDetail() {
  const t = useTranslations("courseRecommend.courseDetail");
  const tCommon = useTranslations();
  const courseSteps = useCourseSteps();
  const router = useRouter();
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = parsePositiveIntParam(courseIdParam);
  const courseDetailQuery = useQuery(
    recommendationQueries.courseDetail(courseId ?? 0, courseId !== null),
  );
  const saveCourseMutation = useMutation({ mutationFn: saveCourse });
  const course = courseDetailQuery.data;

  if (courseId === null) {
    return (
      <FlowShell
        steps={courseSteps}
        currentStep={3}
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
      currentStep={3}
      showStepLabel
      align="start"
      width="wide"
      title={course?.title ?? t("fallbackTitle")}
      description={course ? t("description", { regionName: course.regionName }) : undefined}
    >
      {courseDetailQuery.isPending && <CourseDetailSkeleton />}

      {courseDetailQuery.isError && (
        <SurfaceState
          tone="error"
          title={t("error.title")}
          description={
            isApiError(courseDetailQuery.error)
              ? courseDetailQuery.error.message
              : t("error.description")
          }
          action={{ label: tCommon("retry"), onRetry: () => courseDetailQuery.refetch() }}
        />
      )}

      {course && (
        <div className="border-line bg-surface shadow-card flex w-full flex-col rounded-md border px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-title-2 text-ink pb-4">{t("sectionRoute")}</h2>
          <CourseRoute places={course.places} />

          <h2 className="text-title-2 text-ink border-line mt-8 border-t pt-8 pb-4">
            {t("sectionBenefits")}
          </h2>
          <CourseBenefitList benefits={course.benefits} />

          <div className="border-line mt-6 flex flex-col gap-3 border-t pt-6">
            {saveCourseMutation.isSuccess ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <p className="text-brand-ink text-body-sm flex flex-1 items-center gap-1.5 font-semibold">
                  <Check className="size-4" strokeWidth={2} aria-hidden />
                  {t("saved")}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/saved-courses")}
                  className="sm:w-auto"
                >
                  {t("viewSaved")}
                </Button>
              </div>
            ) : (
              <Button
                size="xl"
                className="w-full"
                disabled={saveCourseMutation.isPending}
                onClick={() => saveCourseMutation.mutate(course.courseId)}
              >
                {saveCourseMutation.isPending ? t("saving") : t("save")}
              </Button>
            )}

            {saveCourseMutation.isError && (
              <p role="alert" className="text-danger-ink text-cap text-center font-medium">
                {isApiError(saveCourseMutation.error)
                  ? saveCourseMutation.error.message
                  : t("saveError")}
              </p>
            )}
          </div>
        </div>
      )}
    </FlowShell>
  );
}
