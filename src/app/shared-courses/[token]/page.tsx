import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

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
  const result = await getSharedCourse(token);

  if (result.status !== "found") {
    return { title: "로컬 밸런스 트립" };
  }

  const description = `${result.course.sharedByName}님이 공유한 여행 코스예요.`;

  return {
    title: `${result.course.title} | 로컬 밸런스 트립`,
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
  const result = await getSharedCourse(token);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "expired") {
    return (
      <main className="w-full flex-1 pb-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pt-10 md:pt-14">
          <SurfaceState
            tone="error"
            title="공유 링크가 만료됐어요"
            description="공유한 사람에게 링크를 다시 받아 주세요."
            action={{ label: "홈으로", href: "/" }}
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
              <span className="text-ink font-semibold">{course.sharedByName}</span>님이 공유한
              코스예요
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
                <SharedStat value={`${course.places.length}곳`} label="방문 장소" />
                <SharedStat
                  value={
                    totalWalkMinutes >= 60
                      ? `${walkHours}시간 ${walkMinutes}분`
                      : `${walkMinutes}분`
                  }
                  label="총 도보"
                />
                <SharedStat value={`${audioGuideCount}개`} label="오디오 가이드" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-line bg-surface shadow-card flex w-full flex-col rounded-md border px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-title-2 text-ink pb-4">코스 순서</h2>
          <CourseRoute places={course.places} />

          {course.benefits.length > 0 && (
            <>
              <h2 className="text-title-2 text-ink border-line mt-8 border-t pt-8 pb-4">
                이 코스 적용 가능 혜택
              </h2>
              <CourseBenefitList benefits={course.benefits} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
