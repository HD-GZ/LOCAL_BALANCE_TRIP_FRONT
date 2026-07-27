import ChevronRight from "@/assets/chevronRight.svg";
import type { CourseBenefit } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

export default function CourseBenefitList({ benefits }: { benefits: CourseBenefit[] }) {
  return (
    <div className="flex w-full flex-col items-start">
      {benefits.map((benefit, index) => (
        <a
          key={benefit.title}
          href={benefit.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex w-full items-center gap-3 border-t border-t-[#EBE7DF] py-4",
            index === benefits.length - 1 && "border-b border-b-[#EBE7DF]",
          )}
        >
          <span className="text-[16px] font-semibold tracking-[-0.16px] text-[#222019]">
            {benefit.title}
          </span>
          {benefit.description && (
            <span className="text-[13.5px] text-[#928D84]">{benefit.description}</span>
          )}
          <span className="flex-1" />
          <ChevronRight className="size-4.5 shrink-0" />
        </a>
      ))}
    </div>
  );
}
