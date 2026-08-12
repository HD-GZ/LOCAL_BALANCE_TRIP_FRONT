"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Walk from "@/assets/walk.svg";
import NaverMap from "@/components/common/NaverMap";
import type { CoursePlace } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

import AudioPlayer from "./AudioPlayer";

/**
 * 코스 동선. 순번과 도보 시간은 세는 값이므로 고정폭 숫자다 (DESIGN.md §6 규칙 2).
 *
 * 펼침/접힘은 상태 전이이므로 애니메이션이 정당하다 (§7). 한 번에 하나만 열리는 것은
 * 동선을 순서대로 따라가는 사용 방식에 맞춘 선택이다.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CourseTimeline({ places }: { places: CoursePlace[] }) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(places[0]?.order ?? null);
  const baseId = useId();
  const reduce = useReducedMotion();

  return (
    <ol className="relative flex w-full flex-col">
      {/* 동선을 잇는 척추. 첫 마커와 마지막 마커 사이만 그린다. */}
      <span aria-hidden className="bg-line-control absolute top-4 bottom-4 left-3.5 w-px" />

      {places.map((place, index) => {
        const isExpanded = expandedOrder === place.order;
        const panelId = `${baseId}-panel-${place.order}`;
        const buttonId = `${baseId}-button-${place.order}`;

        return (
          <li key={place.order} className="relative flex flex-col">
            {index > 0 && place.walkMinutes != null && (
              <p className="text-ink-3 text-cap flex items-center gap-1.5 py-2 pl-11 font-normal">
                <Walk className="size-3 shrink-0" aria-hidden />
                <span className="tabular-nums">도보 {place.walkMinutes}분</span>
              </p>
            )}

            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "text-num relative z-10 mt-1.5 flex size-7 shrink-0 items-center justify-center rounded-full border tabular-nums transition-colors duration-(--dur-2)",
                  isExpanded
                    ? "border-brand bg-brand text-brand-on"
                    : "border-line-strong bg-surface text-ink-2",
                )}
              >
                {place.order}
              </span>

              <div className="flex min-w-0 flex-1 flex-col">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setExpandedOrder(isExpanded ? null : place.order)}
                    className="group flex w-full cursor-pointer items-center gap-2 py-2.5 text-left"
                  >
                    <span
                      className={cn(
                        "text-title-2 flex-1 transition-colors duration-(--dur-1)",
                        isExpanded ? "text-brand-ink" : "text-ink group-hover:text-brand-ink",
                      )}
                    >
                      {place.name}
                    </span>
                    <ChevronDown
                      aria-hidden
                      strokeWidth={1.75}
                      className={cn(
                        "text-ink-3 size-4 shrink-0 transition-transform duration-(--dur-2) ease-(--ease-out-quart)",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reduce ? undefined : { height: 0, opacity: 0 }}
                      animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-4 pb-6 sm:flex-row">
                        <NaverMap
                          latitude={place.latitude}
                          longitude={place.longitude}
                          className="border-line h-40 w-full shrink-0 overflow-hidden rounded-md border sm:h-auto sm:w-40 sm:self-stretch"
                        />
                        <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                          <p className="text-ink-2 text-body-sm">{place.description}</p>
                          {place.hasAudio && place.audioUrl && (
                            <div className="flex w-full flex-col gap-2">
                              <p className="text-ink-3 text-cap font-normal">오디오 가이드</p>
                              <AudioPlayer src={place.audioUrl} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
