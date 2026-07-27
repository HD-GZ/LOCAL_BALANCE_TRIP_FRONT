"use client";

import { useRouter } from "next/navigation";
import ChevronRight from "@/assets/chevronRight.svg";
import ThumbImage from "@/components/common/ThumbImage";
import type { RecommendedRegion } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

type CourseDestinationListProps = {
  destinations: RecommendedRegion[];
};

export default function CourseDestinationList({ destinations }: CourseDestinationListProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 py-2 shadow-[0_1px_2px_0_rgba(40,36,32,0.04),0_12px_32px_-12px_rgba(40,36,32,0.1)]">
      {destinations.map((destination, index) => (
        <button
          key={destination.regionId}
          type="button"
          onClick={() =>
            router.push(
              `/course-recommend/${destination.regionId}?regionName=${encodeURIComponent(destination.regionName)}`,
            )
          }
          className={cn(
            "flex w-full cursor-pointer items-center gap-4 py-4.5",
            index > 0 && "border-t border-t-[#EBE7DF]",
          )}
        >
          <ThumbImage src={destination.imageUrl} alt={destination.regionName} />
          <div className="flex flex-1 flex-col items-start gap-1.25 text-left">
            <p className="text-[17.5px] font-semibold tracking-[-0.35px] text-[#222019]">
              {destination.regionName}
            </p>
            <p className="text-[13.5px] text-[#5F5B53]">{destination.reason}</p>
          </div>
          <ChevronRight className="size-4.5 shrink-0" />
        </button>
      ))}
    </div>
  );
}
