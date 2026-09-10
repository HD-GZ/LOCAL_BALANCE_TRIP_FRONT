import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type SectionHeaderProps = {
  title: string;
  /** 배열로 주면 각 문장을 한 줄씩 나눠 쓴다. */
  description?: string | string[];
  moreHref?: string;
  moreLabel?: string;
};

export default function SectionHeader({
  title,
  description,
  moreHref,
  moreLabel,
}: SectionHeaderProps) {
  const t = useTranslations("home.sectionHeader");
  const resolvedMoreLabel = moreLabel ?? t("moreLabel");

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-title-1 text-ink">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="text-brand-ink text-body-sm hover:decoration-brand-ink flex shrink-0 items-center gap-1 font-semibold decoration-transparent underline-offset-4 transition-colors duration-(--dur-1) hover:underline"
          >
            {resolvedMoreLabel}
            <ArrowRight className="size-3.5" strokeWidth={1.75} />
          </Link>
        )}
      </div>
      {description && (
        <div className="text-ink-2 text-body-sm flex max-w-[64ch] flex-col">
          {(Array.isArray(description) ? description : [description]).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
