"use client";

import { useState } from "react";
import Image from "next/image";
import type { HeroItem } from "@/features/home/types";

type CollagePhotoProps = {
  item: HeroItem | undefined;
  sizes: string;
};

function CollagePhoto({ item, sizes }: CollagePhotoProps) {
  const [hasError, setHasError] = useState(false);

  if (!item?.imageUrl || hasError) {
    return <span className="absolute inset-0 block bg-[#DFEEE4]" />;
  }

  return (
    <Image
      src={item.imageUrl}
      alt={item.title}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}

type HeroCollageProps = {
  items: HeroItem[];
  /** 우측 하단 미니 카드에 표시할 추천 지역명 */
  recommendedRegionName?: string;
};

export default function HeroCollage({ items, recommendedRegionName }: HeroCollageProps) {
  return (
    <div className="relative h-[392px] w-full" aria-hidden={!recommendedRegionName}>
      <span className="absolute inset-[2%_6%_37.8%_44.34%] block rounded-full bg-[#3C875F]/26" />
      <span className="absolute inset-[32%_54.44%_29.73%_14%] block rounded-full bg-[#E0B23D]/50" />
      <span className="absolute inset-[44.13%_2%_12%_61.8%] block rounded-full bg-[#245A40]/50" />
      <div className="absolute inset-[3%_20.01%_22%_24%] overflow-hidden rounded-t-[170px] rounded-b-[22px] border-7 border-white shadow-[0_1px_2px_0_rgba(40,36,28,0.04),0_12px_32px_-12px_rgba(40,36,28,0.14)]">
        <CollagePhoto item={items[0]} sizes="266px" />
      </div>
      <div className="absolute inset-[64.64%_62.24%_4.64%_3.23%] -rotate-4 overflow-hidden rounded-[12px] border-5 border-white shadow-[0_1px_2px_0_rgba(40,36,28,0.04),0_12px_32px_-12px_rgba(40,36,28,0.14)]">
        <CollagePhoto item={items[1]} sizes="164px" />
      </div>
      {recommendedRegionName && (
        <div className="absolute right-0 bottom-[3%] w-56 rounded-[14px] border border-[#EBE7DF] bg-white px-4 py-3.25 shadow-[0_1px_2px_0_rgba(40,36,28,0.04),0_12px_32px_-12px_rgba(40,36,28,0.14)]">
          <p className="text-[14px] leading-[21px] font-semibold tracking-[-0.21px] text-[#222019]">
            이번 달 추천 · {recommendedRegionName}
          </p>
          <p className="mt-0.5 text-[12.5px] text-[#928D84]">취향에 맞춰 골라봤어요</p>
        </div>
      )}
    </div>
  );
}
