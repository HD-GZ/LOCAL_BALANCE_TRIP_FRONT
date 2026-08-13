"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

import Skeleton from "@/components/common/Skeleton";
import type { HeroItem } from "@/features/home/types";

import HeroCollage from "./HeroCollage";

/**
 * 히어로. 기존 디자인(develop)의 그라디언트 카드와 아이브로우 배지를 되돌린 것이다 — 팀 합의 사항.
 *
 * 되돌린 것은 표면 스타일이고, 유지한 것은 다음이다.
 * - 글자 크기는 타입 스케일 토큰. 원본의 45px/15.5px 같은 임의값은 쓰지 않는다
 * - 색은 전부 토큰 → 다크모드와 대비 수정이 그대로 살아 있다
 * - 진입 모션은 걷어냈다. 기존 디자인에는 없었다
 */

type HomeHeroProps = {
  ctaLabel: string;
  ctaHref: string;
  ctaCaption: string;
  heroItems: HeroItem[];
  isHeroPending: boolean;
  children: React.ReactNode;
};

export default function HomeHero({
  ctaLabel,
  ctaHref,
  ctaCaption,
  heroItems,
  isHeroPending,
  children,
}: HomeHeroProps) {
  return (
    <section className="border-brand-line flex w-full flex-col gap-9 overflow-hidden rounded-md border bg-[image:var(--hero-gradient)] px-6 pt-10 sm:px-12 sm:pt-13">
      <div className="grid w-full items-center gap-9 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col items-start gap-4">
          <span className="border-brand-line bg-surface/85 text-brand-ink text-cap flex h-8 items-center gap-2 rounded-full border px-3.5">
            <Leaf className="text-brand size-3.5" strokeWidth={1.75} aria-hidden />
            지역과 여행자를 더 가깝게
          </span>

          <h1 className="text-display-2 text-brand-ink sm:text-display-1 text-balance">
            내 취향에 맞는
            <br />
            로컬 여행을 찾아보세요
          </h1>

          <p className="text-ink-2 text-body max-w-[46ch]">
            여행 성향과 가치소비 기준을 진단해 나에게 맞는 지역과 코스를 추천하고, 받을 수 있는
            정부·지자체 지원 혜택까지 연결해 드려요.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3">
            <Link
              href={ctaHref}
              className="press bg-brand hover:bg-brand-hover active:bg-brand-press text-brand-on text-body flex h-13 items-center rounded-sm px-7 font-semibold"
            >
              {ctaLabel}
            </Link>
            <span className="text-ink-3 text-body-sm">{ctaCaption}</span>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          {isHeroPending ? (
            <Skeleton className="h-98 w-full lg:w-119" rounded="md" />
          ) : (
            <HeroCollage items={heroItems} recommendedRegionName={heroItems[0]?.title} />
          )}
        </div>
      </div>

      {/* 여행 프로필·유형 목록이 히어로 하단에 들어간다. 기존 구성이다. */}
      <div className="border-brand-line w-full border-t pt-6 pb-8">{children}</div>
    </section>
  );
}
