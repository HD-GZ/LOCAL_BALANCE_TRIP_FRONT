import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SavedCourseDetailResponse } from "@/features/recommendation/types";
import { Link } from "@/i18n/navigation";

import CourseStatusBadge from "./CourseStatusBadge";
import SavedCourseDetailTabs from "./SavedCourseDetailTabs";

export default function SavedCourseDetailHeader({
  courseId,
  title,
  regionName,
  status,
}: {
  courseId: number;
  title: string;
  regionName: string;
  status: SavedCourseDetailResponse["status"];
}) {
  const t = useTranslations("savedCourses.courseDetail");

  return (
    <div className="flex w-full flex-col gap-5">
      <Link
        href="/saved-courses"
        className="text-ink-2 text-body-sm hover:text-ink -ml-1 flex w-fit items-center gap-1 font-medium transition-colors duration-(--dur-1)"
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
        {t("backLink")}
      </Link>

      <div className="flex flex-col items-start gap-2">
        <CourseStatusBadge status={status} />
        <h1 className="text-title-1 text-ink sm:text-display-2">{title}</h1>
        <p className="text-ink-2 text-body-sm">{regionName}</p>
      </div>

      <SavedCourseDetailTabs courseId={courseId} />
    </div>
  );
}
