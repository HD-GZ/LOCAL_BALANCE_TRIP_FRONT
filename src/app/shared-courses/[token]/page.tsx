import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import CourseBenefitList from "@/app/[locale]/(main)/course-recommend/courses/[courseId]/CourseBenefitList";
import CourseRoute from "@/app/[locale]/(main)/course-recommend/courses/[courseId]/CourseRoute";
import CourseStatusBadge from "@/app/[locale]/(main)/saved-courses/[courseId]/CourseStatusBadge";
import RouteMarker from "@/assets/routeMarker.svg";
import SurfaceState from "@/components/common/SurfaceState";
import { getSharedCourse } from "@/features/share/serverApi";

type SharedCoursePageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: SharedCoursePageProps): Promise<Metadata> {
  const { token } = await params;
  const [result, t] = await Promise.all([getSharedCourse(token), getTranslations("sharedCourses")]);

  if (result.status !== "found") {
    return { title: t("meta.defaultTitle") };
  }

  const description = t("meta.description", { sharedByName: result.course.sharedByName });

  return {
    title: t("meta.titleWithCourse", { courseName: result.course.title }),
    description,
    openGraph: {
      title: result.course.title,
      description,
      images: [result.course.imageUrl || "/default-thumbnail.png"],
    },
  };
}

function SharedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-start gap-0.5">
      <p className="text-num-lg text-ink tabular-nums">{value}</p>
      <p className="text-ink-3 text-cap font-normal">{label}</p>
    </div>
  );
}

/** 공유 링크로 들어온 사람은 로그인 상태가 아니다. 읽는 것만 가능한 화면이다. */
export default async function SharedCoursePage({ params }: SharedCoursePageProps) {
  const { token } = await params;
  const [result, t] = await Promise.all([getSharedCourse(token), getTranslations("sharedCourses")]);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "expired") {
    return (
      <main className="w-full flex-1 pb-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pt-10 md:pt-14">
          <SurfaceState
            tone="error"
            title={t("expired.title")}
            description={t("expired.description")}
            action={{ label: t("expired.action"), href: "/" }}
          />
        </div>
      </main>
    );
  }

  const { course } = result;
  const totalWalkMinutes = course.places.reduce((sum, place) => sum + (place.walkMinutes ?? 0), 0);
  const walkHours = Math.floor(totalWalkMinutes / 60);
  const walkMinutes = totalWalkMinutes % 60;
  const audioGuideCount = course.places.filter((place) => place.hasAudio).length;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-10 md:px-8 md:pt-14">
        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <p className="text-ink-2 text-body-sm">
              <span className="text-ink font-semibold">{course.sharedByName}</span>
              {t("sharedBySuffix")}
            </p>
            <CourseStatusBadge status={course.status} />
          </div>

          {/*
           * 코스 썸네일은 297×198 수준으로 내려온다. 전폭 배너로 늘리면 4배 확대에
           * 5:1 크롭이 되어 뭉개지므로, 원본 비율(3:2)을 지키는 상자에 담고 제목·지표를
           * 옆에 세운다.
           */}
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-center lg:gap-10">
            <div className="border-line relative aspect-3/2 w-full overflow-hidden rounded-md border bg-[image:--thumb-gradient]">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className="object-cover"
                />
              ) : (
                <RouteMarker className="absolute top-1/2 left-1/2 size-11 -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>

            <div className="flex w-full flex-col items-start gap-5">
              <div className="flex w-full flex-col items-start gap-1.25">
                <p className="text-ink-3 text-cap font-normal">{course.regionName}</p>
                <h1 className="text-display-2 text-ink text-balance">{course.title}</h1>
              </div>

              <div className="border-line flex w-full items-start gap-5 border-t pt-5.5">
                <SharedStat
                  value={t("stats.visitedPlaceValue", { count: course.places.length })}
                  label={t("stats.visitedPlaces")}
                />
                <SharedStat
                  value={
                    totalWalkMinutes >= 60
                      ? t("stats.walkHoursMinutes", { hours: walkHours, minutes: walkMinutes })
                      : t("stats.walkMinutesOnly", { minutes: walkMinutes })
                  }
                  label={t("stats.totalWalk")}
                />
                <SharedStat
                  value={t("stats.audioGuideValue", { count: audioGuideCount })}
                  label={t("stats.audioGuide")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-line bg-surface shadow-card flex w-full flex-col rounded-md border px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-title-2 text-ink pb-4">{t("sections.route")}</h2>
          <CourseRoute places={course.places} />

          {course.benefits.length > 0 && (
            <>
              <h2 className="text-title-2 text-ink border-line mt-8 border-t pt-8 pb-4">
                {t("sections.benefits")}
              </h2>
              <CourseBenefitList benefits={course.benefits} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
