import Link from "next/link";
import { Leaf } from "lucide-react";
import type { HeroItem } from "@/features/home/types";
import HeroCollage from "./HeroCollage";

type HomeHeroProps = {
  ctaLabel: string;
  ctaHref: string;
  ctaCaption: string;
  heroItems: HeroItem[];
  recommendedRegionName?: string;
  /** 히어로 하단 스트립. 진단 전에는 유형 카드, 진단 후에는 진단 요약이 들어간다. */
  children: React.ReactNode;
};

export default function HomeHero({
  ctaLabel,
  ctaHref,
  ctaCaption,
  heroItems,
  recommendedRegionName,
  children,
}: HomeHeroProps) {
  return (
    <section className="flex w-full flex-col gap-9 overflow-hidden rounded-[26px] border border-[#C4DDCD] bg-linear-[120deg,#E9F2EA_0%,#EEF4E8_46%,#F7F1E4_100%] px-11.75 pt-13.25">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-9">
        <div className="flex flex-col items-start gap-4.25">
          <span className="flex h-8 items-center gap-2 rounded-full border border-[#C4DDCD] bg-white/82 px-3.5 text-[12.5px] font-semibold text-[#1C4631]">
            <Leaf className="size-3.5 text-[#3C875F]" />
            지역과 여행자를 더 가깝게
          </span>
          <h1 className="text-[45px] leading-[52.2px] font-bold tracking-[-1.575px] text-[#1C4631]">
            내 취향에 맞는
            <br />
            로컬 여행을 찾아보세요
          </h1>
          <p className="max-w-107.5 text-[15.5px] leading-[25.58px] text-[#5F5B53]">
            여행 성향과 가치소비 기준을 진단해 나에게 맞는 지역과 코스를 추천하고, 받을 수 있는
            정부·지자체 지원 혜택까지 연결해 드려요.
          </p>
          <div className="flex flex-wrap items-center gap-x-4.5 pt-2.75">
            <Link
              href={ctaHref}
              className="flex h-13 items-center justify-center rounded-[12px] bg-[#2F6F4F] px-7.25 text-[15.5px] font-semibold tracking-[-0.155px] text-white"
            >
              {ctaLabel}
            </Link>
            <span className="text-[13px] text-[#928D84]">{ctaCaption}</span>
          </div>
        </div>
        <HeroCollage items={heroItems} recommendedRegionName={recommendedRegionName} />
      </div>
      <div className="w-full border-t border-[#C4DDCD] pt-5.75 pb-7.5">{children}</div>
    </section>
  );
}
