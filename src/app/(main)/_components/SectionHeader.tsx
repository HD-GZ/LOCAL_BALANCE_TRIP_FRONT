import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <div className="flex w-full flex-col gap-1.75">
      <div className="flex w-full items-end justify-between gap-4">
        <h2 className="text-[25px] font-semibold tracking-[-0.7px] text-[#222019]">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="flex shrink-0 items-center gap-0.5 text-[13.5px] font-semibold text-[#2F6F4F]"
          >
            {moreLabel}
            <ChevronRight className="size-3.5" />
          </Link>
        )}
      </div>
      <p className="text-[14.5px] leading-[21.75px] text-[#5F5B53]">{description}</p>
    </div>
  );
}
