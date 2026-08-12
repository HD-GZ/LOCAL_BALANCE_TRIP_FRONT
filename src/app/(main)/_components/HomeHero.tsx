"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import Skeleton from "@/components/common/Skeleton";
import type { HeroItem } from "@/features/home/types";

import HeroFigure from "./HeroFigure";

/**
 * 히어로. DESIGN.md §11, 그리고 hero stack discipline:
 * 텍스트 요소는 제목 / 본문 / CTA 세 개뿐이다. 아이브로우 배지는 제거했다.
 *
 * 진입 모션은 이 표면에서 유일하게 연출된 순간이다 (§7).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type HomeHeroProps = {
  ctaLabel: string;
  ctaHref: string;
  ctaCaption: string;
  heroItems: HeroItem[];
  isHeroPending: boolean;
};

export default function HomeHero({
  ctaLabel,
  ctaHref,
  ctaCaption,
  heroItems,
  isHeroPending,
}: HomeHeroProps) {
  const reduce = useReducedMotion();

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.42, delay, ease: EASE },
        };

  return (
    <section className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <motion.h1
          {...enter(0)}
          className="text-display-2 text-ink sm:text-display-1 max-w-[18ch] text-balance"
        >
          내 취향에 맞는 로컬 여행
        </motion.h1>

        <motion.p {...enter(0.08)} className="text-ink-2 text-body max-w-[46ch]">
          취향과 가치소비 기준으로 지역과 코스를 추천하고, 받을 수 있는 정부·지자체 지원까지 연결해
          드려요.
        </motion.p>

        <motion.div {...enter(0.16)} className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
          <Link
            href={ctaHref}
            className="press bg-brand hover:bg-brand-hover active:bg-brand-press text-body text-brand-on flex h-13 items-center gap-2 rounded-sm px-6 font-semibold"
          >
            {ctaLabel}
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
          <span className="text-ink-3 text-body-sm">{ctaCaption}</span>
        </motion.div>
      </div>

      <motion.div {...enter(0.1)} className="w-full">
        {isHeroPending ? (
          // HeroFigure 와 같은 골격: 아치형 리드 + 보조 2장 + 캡션 2줄
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:items-end">
              <Skeleton
                className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-md"
                rounded="none"
              />
              <div className="flex flex-col gap-3">
                <Skeleton className="aspect-[3/2] w-full" rounded="md" />
                <Skeleton className="aspect-[3/2] w-full" rounded="md" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        ) : (
          <HeroFigure items={heroItems} />
        )}
      </motion.div>
    </section>
  );
}
