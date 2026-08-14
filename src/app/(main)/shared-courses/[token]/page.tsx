import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import CourseBenefitList from "@/app/(main)/course-recommend/courses/[courseId]/CourseBenefitList";
import CourseTimeline from "@/app/(main)/course-recommend/courses/[courseId]/CourseTimeline";
import CourseStatusBadge from "@/app/(main)/saved-courses/[courseId]/CourseStatusBadge";
import RouteMarker from "@/assets/routeMarker.svg";
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

export default async function SharedCoursePage({ params }: SharedCoursePageProps) {
  const { token } = await params;
  const result = await getSharedCourse(token);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "expired") {
    return (
      <div className="flex w-full flex-col items-center pb-20">
        <p className="mt-9.5 text-[13px] text-red-500">공유 링크가 만료됐어요.</p>
      </div>
    );
  }

  const { course } = result;
  const totalWalkMinutes = course.places.reduce((sum, place) => sum + (place.walkMinutes ?? 0), 0);
  const walkHours = Math.floor(totalWalkMinutes / 60);
  const walkMinutes = totalWalkMinutes % 60;
  const audioGuideCount = course.places.filter((place) => place.hasAudio).length;

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <div className="mt-8.5 flex w-180 flex-col items-center">
        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full items-center justify-between">
            <p className="text-[13.5px] text-[#5F5B53]">
              <span className="font-semibold text-[#222019]">{course.sharedByName}</span>님이
              공유한 코스예요
            </p>
            <CourseStatusBadge status={course.status} />
          </div>
          <div className="relative h-56 w-full overflow-hidden rounded-[18px] border border-[#EBE7DF] bg-linear-to-br from-[#E7F0EA] via-[#DFEEE4] to-[#D3E6DA]">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                sizes="720px"
                className="object-cover"
              />
            ) : (
              <RouteMarker className="absolute top-1/2 left-1/2 size-11 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1.25">
            <p className="text-[13.5px] text-[#928D84]">{course.regionName}</p>
            <p className="text-[26px] font-semibold tracking-[-0.65px] text-[#222019]">
              {course.title}
            </p>
          </div>
          <div className="flex w-full items-start justify-center gap-5 border-t border-[#EBE7DF] pt-5.5">
            <div className="flex w-full flex-1 flex-col items-start gap-0.5">
              <p className="text-[20px] font-bold tracking-[-0.4px] text-[#222019]">
                {course.places.length}곳
              </p>
              <p className="text-[12.5px] text-[#928D84]">방문 장소</p>
            </div>
            <div className="flex w-full flex-1 flex-col items-start gap-0.5">
              <p className="text-[20px] font-bold tracking-[-0.4px] text-[#222019]">
                {totalWalkMinutes >= 60 ? `${walkHours}시간 ${walkMinutes}분` : `${walkMinutes}분`}
              </p>
              <p className="text-[12.5px] text-[#928D84]">총 도보</p>
            </div>
            <div className="flex w-full flex-1 flex-col items-start gap-0.5">
              <p className="text-[20px] font-bold tracking-[-0.4px] text-[#222019]">
                {audioGuideCount}개
              </p>
              <p className="text-[12.5px] text-[#928D84]">오디오 가이드</p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start pt-6.5">
          <p className="pb-3.5 text-[14px] font-semibold tracking-[-0.14px] text-[#222019]">
            코스 순서
          </p>
          <CourseTimeline places={course.places} />
          {course.benefits.length > 0 && (
            <>
              <div className="flex w-full flex-col items-center py-7.5">
                <span className="h-px w-full bg-[#EBE7DF]" />
              </div>
              <p className="pb-3.5 text-[16px] font-semibold tracking-[-0.24px] text-[#222019]">
                이 코스 적용 가능 혜택
              </p>
              <CourseBenefitList benefits={course.benefits} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
