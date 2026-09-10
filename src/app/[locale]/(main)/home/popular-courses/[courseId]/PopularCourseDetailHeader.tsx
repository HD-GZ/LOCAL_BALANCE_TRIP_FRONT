import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type PopularCourseDetailHeaderProps = {
  title: string;
  regionName: string;
};

export default function PopularCourseDetailHeader({
  title,
  regionName,
}: PopularCourseDetailHeaderProps) {
  const t = useTranslations("home.popularCourseDetail");

  return (
    <div className="flex w-full flex-col gap-5">
      <Link
        href="/"
        className="text-ink-2 text-body-sm hover:text-ink -ml-1 flex w-fit items-center gap-1 font-medium transition-colors duration-(--dur-1)"
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
        {t("backLink")}
      </Link>

      <div className="flex flex-col items-start gap-2">
        <h1 className="text-title-1 text-ink sm:text-display-2">{title}</h1>
        <p className="text-ink-2 text-body-sm">{regionName}</p>
      </div>
    </div>
  );
}
