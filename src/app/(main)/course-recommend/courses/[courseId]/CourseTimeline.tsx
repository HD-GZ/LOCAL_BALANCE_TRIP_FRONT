"use client";

import { useState } from "react";
import AccordionChevron from "@/assets/accordionChevron.svg";
import ChevronRight from "@/assets/chevronRight.svg";
import Headphone from "@/assets/headphone.svg";
import MapPinMarker from "@/assets/mapPinMarker.svg";
import Walk from "@/assets/walk.svg";
import type { CoursePlace } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";
import AudioPlayer from "./AudioPlayer";

export default function CourseTimeline({ places }: { places: CoursePlace[] }) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(places[0]?.order ?? null);

  return (
    <div className="relative flex w-full flex-col items-start">
      <span className="absolute top-3.75 bottom-3.75 left-3.75 w-[1.5px] bg-[#C4DDCD]" />
      {places.map((place, index) => {
        const isExpanded = expandedOrder === place.order;

        return (
          <div key={place.order} className="relative z-10 flex w-full flex-col items-start">
            {index > 0 && (
              <div className="flex items-center gap-1.5 py-1.5 pl-9.5 font-mono text-[11px] text-[#928D84]">
                <Walk className="size-3" />
                <span>도보 {place.walkMinutes}분</span>
              </div>
            )}
            <div className="flex w-full items-start gap-3.5">
              <span
                className={cn(
                  "flex size-7.5 shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono text-[13px] font-semibold",
                  isExpanded
                    ? "border-[#2F6F4F] bg-[#2F6F4F] text-white"
                    : "border-[#C4DDCD] bg-white text-[#2F6F4F]",
                )}
              >
                {place.order}
              </span>
              <div className="flex flex-1 flex-col items-start">
                <button
                  type="button"
                  onClick={() => setExpandedOrder(isExpanded ? null : place.order)}
                  className="flex w-full cursor-pointer items-center gap-1 py-2.75"
                >
                  <span className="flex-1 text-left text-[16px] font-semibold tracking-[-0.24px] text-[#222019]">
                    {place.name}
                  </span>
                  {isExpanded ? (
                    <AccordionChevron className="size-4.5 shrink-0" />
                  ) : (
                    <ChevronRight className="size-4.5 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="flex w-full gap-4 pb-5">
                    <div className="relative h-auto w-37.5 shrink-0 self-stretch rounded-xl border border-[#C4DDCD] bg-[#E4F0E8]">
                      <MapPinMarker className="absolute top-1/2 left-1/2 size-6.5 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex flex-1 flex-col items-start">
                      <p className="text-[13.5px] leading-relaxed text-[#5F5B53]">
                        {place.description}
                      </p>
                      {place.hasAudio && place.audioUrl && (
                        <>
                          <div className="flex items-center gap-1.5 pt-3.5 pb-2">
                            <Headphone className="size-3" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.88px] text-[#928D84]">
                              오디오 가이드
                            </span>
                          </div>
                          <AudioPlayer src={place.audioUrl} />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
