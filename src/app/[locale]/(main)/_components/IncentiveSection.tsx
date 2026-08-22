"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";
import type { Incentive } from "@/features/home/types";
import { cn } from "@/lib/utils";

import SectionHeader from "./SectionHeader";

/**
 * 혜택. 기존 디자인(develop)의 흰 카드 그리드로 되돌린 것이다 — 팀 합의 사항.
 * 마감일은 카드 안에서 의미 색(danger)으로 표시한다.
 */

function DeadlineMark({ dday }: { dday: number | null }) {
  const t = useTranslations("home.incentive.deadline");

  if (dday === null) {
    return <span className="text-ink-3 text-cap shrink-0 font-normal">{t("ongoing")}</span>;
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
      <span className="sr-only">{isUrgent ? t("urgentSuffix") : t("remainingSuffix")}</span>
    </span>
  );
}

function IncentiveCard({ incentive, regionName }: { incentive: Incentive; regionName: string }) {
  const t = useTranslations("home.incentive");

  return (
    <li className="flex">
      <a
        href={incentive.url}
        target="_blank"
        rel="noreferrer"
        className="lift border-line bg-surface group flex flex-1 flex-col items-start gap-3 rounded-md border px-5 py-5"
      >
        <span className="flex w-full items-center justify-between gap-2.5">
          <span className="border-brand-line bg-brand-wash text-brand-ink text-cap flex h-6.5 shrink-0 items-center rounded-full border px-3">
            {regionName}
          </span>
          <DeadlineMark dday={incentive.dday} />
        </span>

        <span className="text-title-2 text-ink group-hover:text-brand-ink transition-colors duration-(--dur-1)">
          {incentive.title}
        </span>
        {incentive.description && (
          <span className="text-ink-2 text-body-sm line-clamp-2">{incentive.description}</span>
        )}

        <span className="border-line text-brand-ink text-body-sm mt-auto flex w-full items-center gap-0.5 border-t pt-3 font-semibold">
          {t("applyCta")}
          <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden />
        </span>
      </a>
    </li>
  );
}

export default function IncentiveSection() {
  const t = useTranslations("home.incentive");
  const tCommon = useTranslations();
  const incentivesQuery = useQuery(homeQueries.incentives());
  const regions = incentivesQuery.data?.regions ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRegion = regions[selectedIndex] ?? regions[0];

  return (
    <section className="flex w-full flex-col gap-5">
      <SectionHeader
        title={t("title")}
        description={[t("description1"), t("description2")]}
      />

      {incentivesQuery.isPending && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-20" rounded="full" />
            ))}
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="border-line bg-surface flex flex-col gap-3 rounded-md border p-5"
              >
                <Skeleton className="h-6 w-20" rounded="full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      )}

      {incentivesQuery.isError && (
        <SurfaceState
          tone="error"
          title={t("error.title")}
          description={t("error.description")}
          action={{ label: tCommon("retry"), onRetry: () => incentivesQuery.refetch() }}
        />
      )}

      {incentivesQuery.isSuccess && regions.length === 0 && (
        <SurfaceState
          variant="plain"
          title={t("empty.title")}
          description={t("empty.description")}
          action={{ label: t("empty.cta"), href: "/course-recommend?step=1" }}
        />
      )}

      {selectedRegion && (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("tabsAriaLabel")}>
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
                variant="plain"
                title={t("regionEmpty.title", { regionName: selectedRegion.regionName })}
                description={t("regionEmpty.description")}
              />
            ) : (
              <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedRegion.incentives.map((incentive) => (
                  <IncentiveCard
                    key={`${incentive.title}-${incentive.url}`}
                    incentive={incentive}
                    regionName={selectedRegion.regionName}
                  />
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
