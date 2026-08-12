"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Walk from "@/assets/walk.svg";
import type { CoursePlace } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

import AudioPlayer from "./AudioPlayer";

/**
 * 코스 동선 목록. 지도는 CourseRoute 가 옆에 따로 들고 있고 선택 상태를 공유한다.
 * 장소마다 작은 지도를 품고 있던 이전 구조에서는 코스가 어떻게 이어지는지 볼 수 없었다.
 *
 * 순번과 도보 시간은 세는 값이므로 자리수를 고정한다 (DESIGN.md §6 규칙 2).
 * 펼침/접힘은 상태 전이이므로 애니메이션이 정당하다 (§7).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** 지도 마커를 눌렀을 때 해당 항목으로 스크롤하기 위한 앵커. */
export function placeAnchorId(order: number) {
  return `course-place-${order}`;
}

type CourseTimelineProps = {
  places: CoursePlace[];
  expandedOrder: number | null;
  onToggle: (order: number) => void;
};

export default function CourseTimeline({ places, expandedOrder, onToggle }: CourseTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <ol className="relative flex w-full flex-col">
      {/* 동선을 잇는 척추. 첫 마커와 마지막 마커 사이만 그린다. */}
      <span aria-hidden className="bg-line-control absolute top-4 bottom-4 left-3.5 w-px" />

      {places.map((place, index) => {
        const isExpanded = expandedOrder === place.order;
        const panelId = `course-panel-${place.order}`;
        const buttonId = `course-button-${place.order}`;

        return (
          <li
            key={place.order}
            id={placeAnchorId(place.order)}
            className="relative flex scroll-mt-24 flex-col"
          >
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
                    : "border-line-control bg-surface text-ink-2",
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
                    onClick={() => onToggle(place.order)}
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
                      <div className="flex flex-col items-start gap-3 pb-6">
                        <p className="text-ink-2 text-body-sm max-w-[68ch]">{place.description}</p>
                        {place.hasAudio && place.audioUrl && (
                          <div className="flex w-full flex-col gap-2">
                            <p className="text-ink-3 text-cap font-normal">오디오 가이드</p>
                            <AudioPlayer src={place.audioUrl} />
                          </div>
                        )}
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
