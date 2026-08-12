"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";
import type { Incentive } from "@/features/home/types";
import { cn } from "@/lib/utils";

import SectionHeader from "./SectionHeader";

/**
 * 혜택. 이전 구현은 3열 카드 그리드였고, 그러면 위쪽 코스 그리드와 같은 레이아웃 계열이
 * 되어 표면이 단조로워진다 (DESIGN.md §11).
 *
 * 그래서 여기는 장부(ledger) 계열이다: 괘선으로 나뉜 행, 오른쪽에 고정폭 마감일.
 * 마감이 스캔의 핵심이므로 브릭은 여기서 의미로서 쓰인다 (§3).
 */

function DeadlineMark({ dday }: { dday: number | null }) {
  if (dday === null) {
    return <span className="text-ink-3 text-cap shrink-0 font-normal">상시 모집</span>;
  }

  const isUrgent = dday <= 7;

  return (
    <span
      className={cn(
        "text-num shrink-0 tabular-nums",
        isUrgent ? "text-danger-ink font-semibold" : "text-ink-2",
      )}
    >
      D-{dday}
      <span className="sr-only">{isUrgent ? " 마감 임박" : " 남음"}</span>
    </span>
  );
}

function IncentiveRow({ incentive }: { incentive: Incentive }) {
  return (
    <li>
      <a
        href={incentive.url}
        target="_blank"
        rel="noreferrer"
        className="group hover:bg-surface-2 border-line -mx-3 flex h-full items-start gap-4 rounded-sm border-b px-3 py-4 transition-colors duration-(--dur-1)"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-title-3 text-ink group-hover:text-brand-ink flex items-center gap-1.5 transition-colors duration-(--dur-1)">
            <span className="min-w-0">{incentive.title}</span>
            <ArrowUpRight
              aria-hidden
              className="text-ink-3 group-hover:text-brand-ink size-3.5 shrink-0 transition-all duration-(--dur-2) group-hover:translate-x-px group-hover:-translate-y-px"
              strokeWidth={1.75}
            />
          </span>
          {incentive.description && (
            <span className="text-ink-2 text-body-sm line-clamp-2">{incentive.description}</span>
          )}
        </span>
        <DeadlineMark dday={incentive.dday} />
      </a>
    </li>
  );
}

export default function IncentiveSection() {
  const incentivesQuery = useQuery(homeQueries.incentives());
  const regions = incentivesQuery.data?.regions ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRegion = regions[selectedIndex] ?? regions[0];

  return (
    <section className="flex w-full flex-col gap-5">
      <SectionHeader
        title="추천 지역에서 받을 수 있는 혜택"
        description="추천받은 지역의 정부·지자체 지원을 모았어요. 신청은 각 기관 공식 채널에서 진행돼요."
      />

      {incentivesQuery.isPending && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-20" rounded="full" />
            ))}
          </div>
          <div className="border-line divide-line flex flex-col divide-y border-t">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-start gap-4 py-4">
                <span className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </span>
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      )}

      {incentivesQuery.isError && (
        <SurfaceState
          tone="error"
          title="혜택을 불러오지 못했어요"
          description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
          action={{ label: "다시 시도", onRetry: () => incentivesQuery.refetch() }}
        />
      )}

      {incentivesQuery.isSuccess && regions.length === 0 && (
        <SurfaceState
          title="진행 중인 혜택이 아직 없어요"
          description="지역을 추천받으면 그 지역의 지원 사업이 여기에 모여요."
          action={{ label: "코스 추천 보기", href: "/course-recommend?step=1" }}
        />
      )}

      {selectedRegion && (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="지역별 혜택">
            {regions.map((region, index) => {
              const isSelected = region === selectedRegion;

              return (
                <button
                  key={`${region.ldongRegnCd}-${region.ldongSignguCd}`}
                  id={`incentive-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="incentive-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "press text-body-sm flex h-9 cursor-pointer items-center rounded-full border px-4 font-semibold",
                    isSelected
                      ? "border-brand bg-brand text-brand-on"
                      : "border-line-control text-ink-2 hover:border-ink-3 hover:text-ink bg-transparent",
                  )}
                >
                  {region.regionName}
                </button>
              );
            })}
          </div>

          <div
            id="incentive-panel"
            role="tabpanel"
            aria-labelledby={`incentive-tab-${selectedIndex}`}
          >
            {selectedRegion.incentives.length === 0 ? (
              <SurfaceState
                title={`${selectedRegion.regionName}에 진행 중인 혜택이 없어요`}
                description="다른 지역 탭을 눌러 확인해 보세요."
              />
            ) : (
              // 넓은 폭에서는 2열로 밀도를 올린다. 격자에서는 divide-y 가 성립하지 않아
              // 행마다 위쪽 괘선을 두고 첫 행만 예외 처리한다.
              <ul className="border-line grid border-t xl:grid-cols-2 xl:gap-x-10">
                {selectedRegion.incentives.map((incentive) => (
                  <IncentiveRow key={`${incentive.title}-${incentive.url}`} incentive={incentive} />
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
