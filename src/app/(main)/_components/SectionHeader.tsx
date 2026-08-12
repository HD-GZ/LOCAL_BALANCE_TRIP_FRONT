import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  description: string;
  moreHref?: string;
  moreLabel?: string;
};

export default function SectionHeader({
  title,
  description,
  moreHref,
  moreLabel = "전체 보기",
}: SectionHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-title-1 text-ink">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="text-brand-ink text-body-sm hover:decoration-brand-ink flex shrink-0 items-center gap-1 font-semibold decoration-transparent underline-offset-4 transition-colors duration-(--dur-1) hover:underline"
          >
            {moreLabel}
            <ArrowRight className="size-3.5" strokeWidth={1.75} />
          </Link>
        )}
      </div>
      <p className="text-ink-2 text-body-sm max-w-[64ch]">{description}</p>
    </div>
  );
}
