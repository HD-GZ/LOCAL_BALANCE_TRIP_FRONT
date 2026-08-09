"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { homeQueries } from "@/features/home/queries";
import type { Incentive } from "@/features/home/types";
import { cn } from "@/lib/utils";
import HomeSectionState from "./HomeSectionState";
import SectionHeader from "./SectionHeader";

type IncentiveCardProps = {
  incentive: Incentive;
  regionName: string;
};

function IncentiveCard({ incentive, regionName }: IncentiveCardProps) {
  const isAlwaysOpen = incentive.dday === null;

  return (
    <a
      href={incentive.url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-start gap-3 rounded-[18px] border border-[#EBE7DF] bg-white px-5.75 pt-5.25 pb-5.75"
    >
      <div className="flex w-full items-center justify-between gap-2.5">
        <span className="flex h-6.5 shrink-0 items-center rounded-full border border-[#C4DDCD] bg-[#E7F0EA] px-3 text-[12px] font-semibold text-[#1C4631]">
          {regionName}
        </span>
        <span
          className={cn(
            "shrink-0 text-[12px] font-semibold",
            isAlwaysOpen ? "text-[#2F6F4F]" : "text-[#B5654A]",
          )}
        >
          {isAlwaysOpen ? "상시 모집" : `마감 ${incentive.dday}일 전`}
        </span>
      </div>
      <p className="text-[18px] font-semibold tracking-[-0.36px] text-[#222019]">
        {incentive.title}
      </p>
      {incentive.description && (
        <p className="line-clamp-2 text-[13.5px] leading-[21.6px] text-[#5F5B53]">
          {incentive.description}
        </p>
      )}
      <span className="mt-auto flex w-full items-center gap-0.5 border-t border-[#EBE7DF] pt-3.25 text-[13.5px] font-semibold text-[#2F6F4F]">
        신청 페이지 바로가기
        <ChevronRight className="size-3.5" />
      </span>
    </a>
  );
}

export default function IncentiveSection() {
  const incentivesQuery = useQuery(homeQueries.incentives());
  const regions = incentivesQuery.data?.regions ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRegion = regions[selectedIndex] ?? regions[0];

  return (
    <section className="flex w-full flex-col gap-4.25">
      <SectionHeader
        title="추천 지역에서 받을 수 있는 혜택"
        description="추천받은 지역의 정부·지자체 지원을 모았어요 · 신청은 각 기관 공식 채널에서 진행돼요"
      />
      {incentivesQuery.isPending && <HomeSectionState message="혜택을 불러오는 중..." />}
      {incentivesQuery.isError && (
        <HomeSectionState message="혜택을 불러오지 못했어요." tone="error" />
      )}
      {incentivesQuery.isSuccess && regions.length === 0 && (
        <HomeSectionState message="진행중인 혜택이 아직 없어요." />
      )}
      {selectedRegion && (
        <>
          <div className="flex flex-wrap items-start gap-2" role="tablist" aria-label="지역별 혜택">
            {regions.map((region, index) => {
              const isSelected = region === selectedRegion;

              return (
                <button
                  key={`${region.ldongRegnCd}-${region.ldongSignguCd}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "flex h-8.5 cursor-pointer items-center justify-center rounded-full border px-3.75 text-[13.5px] font-medium",
                    isSelected
                      ? "border-[#2F6F4F] bg-[#2F6F4F] text-white"
                      : "border-[#EBE7DF] bg-white text-[#5F5B53]",
                  )}
                >
                  {region.regionName}
                </button>
              );
            })}
          </div>
          {selectedRegion.incentives.length === 0 ? (
            <HomeSectionState message="이 지역에 진행중인 혜택이 없어요." />
          ) : (
            <div className="grid w-full grid-cols-3 gap-4">
              {selectedRegion.incentives.map((incentive) => (
                <IncentiveCard
                  key={`${incentive.title}-${incentive.url}`}
                  incentive={incentive}
                  regionName={selectedRegion.regionName}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
