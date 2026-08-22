"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { HeroItem } from "@/features/home/types";

/**
 * 히어로 콜라주. 기존 디자인(develop)의 구성을 되돌린 것이다 — 팀 합의 사항.
 *
 * 값은 하드코딩하지 않고 토큰으로 쓴다. 그래야 다크모드와 대비 수정이 유지된다.
 * 원 세 개와 회전 폴라로이드는 장식이므로 스크린 리더에서 감춘다.
 */

type CollagePhotoProps = {
  item: HeroItem | undefined;
  sizes: string;
  priority?: boolean;
};

function CollagePhoto({ item, sizes, priority }: CollagePhotoProps) {
  const [hasError, setHasError] = useState(false);

  if (!item?.imageUrl || hasError) {
    return <span className="bg-brand-tint absolute inset-0 block" />;
  }

  return (
    <Image
      src={item.imageUrl}
      alt={item.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}

type HeroCollageProps = {
  items: HeroItem[];
  recommendedRegionName?: string;
};

export default function HeroCollage({ items, recommendedRegionName }: HeroCollageProps) {
  const t = useTranslations("home.hero.collage");

  return (
    <div className="flex h-98 w-full justify-end" aria-hidden={!recommendedRegionName}>
      <div className="relative h-full w-119 shrink-0">
        <span className="bg-brand/26 absolute top-[2%] left-[44.34%] block aspect-square w-[49.66%] rounded-full" />
        <span className="bg-decor-amber/50 absolute top-[32%] left-[14%] block aspect-square w-[31.57%] rounded-full" />
        <span className="bg-brand-press/50 absolute top-[44.13%] left-[61.8%] block aspect-square w-[36.2%] rounded-full" />

        <div className="border-surface shadow-card absolute inset-[3%_20.01%_22%_24%] overflow-hidden rounded-t-[170px] rounded-b-md border-7">
          <CollagePhoto item={items[0]} sizes="266px" priority />
        </div>
        <div className="border-surface shadow-card absolute inset-[64.64%_62.24%_4.64%_3.23%] -rotate-4 overflow-hidden rounded-sm border-5">
          <CollagePhoto item={items[1]} sizes="164px" />
        </div>

        {recommendedRegionName && (
          <div className="border-line bg-surface shadow-card absolute right-0 bottom-[3%] w-56 rounded-md border px-4 py-3">
            <p className="text-title-3 text-ink">
              {t("recommendedThisMonth", { regionName: recommendedRegionName })}
            </p>
            <p className="text-ink-3 text-cap mt-0.5 font-normal">{t("matchedToTaste")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
