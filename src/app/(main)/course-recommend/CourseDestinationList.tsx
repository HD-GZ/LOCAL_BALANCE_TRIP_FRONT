"use client";

import { useState } from "react";
import ChevronRight from "@/assets/chevronRight.svg";
import RouteMarker from "@/assets/routeMarker.svg";
import { cn } from "@/lib/utils";

export type RecommendedDestination = {
  id: string;
  region: string;
  description: string;
};

type CourseDestinationListProps = {
  destinations: RecommendedDestination[];
};

export default function CourseDestinationList({ destinations }: CourseDestinationListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col items-start rounded-[18px] border border-[#EBE7DF] bg-white px-7.5 py-2 shadow-[0_1px_2px_0_rgba(40,36,32,0.04),0_12px_32px_-12px_rgba(40,36,32,0.1)]">
      {destinations.map((destination, index) => (
        <button
          key={destination.id}
          type="button"
          onClick={() => setSelectedId(destination.id)}
          aria-pressed={selectedId === destination.id}
          className={cn(
            "flex w-full cursor-pointer items-center gap-4 py-4.5",
            index > 0 && "border-t border-t-[#EBE7DF]",
          )}
        >
          <span
            className={cn(
              "flex size-19 shrink-0 items-center justify-center rounded-[14px] bg-[#E2EFE7]",
              selectedId === destination.id && "ring-2 ring-[#2F6F4F]",
            )}
          >
            <RouteMarker className="size-8" />
          </span>
          <div className="flex flex-1 flex-col items-start gap-1.25 text-left">
            <p className="text-[17.5px] font-semibold tracking-[-0.35px] text-[#222019]">
              {destination.region}
            </p>
            <p className="text-[13.5px] text-[#5F5B53]">{destination.description}</p>
          </div>
          <ChevronRight className="size-4.5 shrink-0" />
        </button>
      ))}
    </div>
  );
}
