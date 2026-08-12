"use client";

import { useState } from "react";
import Image from "next/image";

import type { HeroItem } from "@/features/home/types";
import { cn } from "@/lib/utils";

/**
 * 히어로 이미지. DESIGN.md §6 규칙 4.
 *
 * 아치(문·관문) 형태는 이 서비스의 서명 형태다 — 여행지의 입구를 가리키고,
 * 스크린샷만으로 이 제품을 알아보게 한다. 모서리 라디우스 규칙(2/4/8px)은
 * 모서리 처리에 대한 것이므로 형태에는 적용되지 않는다 (§5).
 *
 * 흰 마운트는 사진의 물리적 액자다. `paper` 와 `surface` 의 밝기차가 1.09:1 뿐이라
 * 마운트만으로는 바닥과 구분되지 않으므로, 그림자 대신 헤어라인 링으로 외곽을 잡는다.
 *
 * 버린 것: 블롭 원 3개(정보 0, 팔레트 밖 앰버), 4° 회전(템플릿 신호),
 * 사진 위에 떠 있던 흰 카드(정보를 장식에 묻는다).
 */

/** 히어로가 담는 사진 수. 응답 개수는 백엔드가 정하므로 여기서 잘라낸다. */
const MAX_PHOTOS = 3;

const MOUNT = "bg-surface ring-line block overflow-hidden p-1.5 ring-1";
const ARCH = "rounded-t-[999px] rounded-b-md";

function HeroPhoto({
  item,
  sizes,
  aspect,
  shape,
  priority,
  className,
}: {
  item: HeroItem;
  sizes: string;
  aspect: string;
  shape: "arch" | "plain";
  priority?: boolean;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const hasPhoto = Boolean(item.imageUrl) && !hasError;

  return (
    <span className={cn(MOUNT, shape === "arch" ? ARCH : "rounded-md", className)}>
      <span
        className={cn(
          "bg-paper-sunk relative block overflow-hidden",
          aspect,
          shape === "arch" ? ARCH : "rounded-sm",
        )}
      >
        {hasPhoto && item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            onError={() => setHasError(true)}
          />
        )}
      </span>
    </span>
  );
}

export default function HeroFigure({ items }: { items: HeroItem[] }) {
  /**
   * 사진과 캡션은 같은 배열에서 나와야 한다. 캡션이 5곳을 나열하는데 사진이 3장이면
   * 읽는 사람은 2장이 빠졌다고 느낀다. 보여주는 것만 이름 붙인다.
   */
  const [lead, ...supporting] = items.slice(0, MAX_PHOTOS);
  /**
   * 캡션은 대표 지역 한 곳과 나머지 개수만 말한다.
   * 지역명을 전부 나열하면 길고, 브레이크포인트마다 보이는 사진 수가 달라
   * "이름 5개 / 사진 3장" 같은 어긋남이 생긴다. 전체 목록은 코스 추천 화면이 담당한다.
   */
  const remaining = items.length - 1;

  if (!lead) {
    return null;
  }

  return (
    <figure className="flex flex-col gap-4">
      <div
        className={cn(
          "grid gap-3",
          // 보조 사진이 없으면 열을 나누지 않는다. 빈 칸을 남기지 않는다.
          supporting.length > 0 && "sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:items-end",
        )}
      >
        <HeroPhoto
          item={lead}
          sizes="(max-width: 640px) 15rem, (max-width: 1024px) 45vw, 26rem"
          aspect="aspect-[4/5]"
          shape="arch"
          priority
          className="mx-auto w-full max-w-60 sm:mx-0 sm:max-w-none"
        />
        {supporting.length > 0 && (
          <div className="hidden flex-col gap-3 sm:flex">
            {supporting.map((item) => (
              <HeroPhoto
                key={item.title}
                item={item}
                sizes="(max-width: 1024px) 40vw, 22rem"
                aspect={supporting.length === 1 ? "aspect-[4/5]" : "aspect-[3/2]"}
                shape="plain"
              />
            ))}
          </div>
        )}
      </div>

      {/* 추천 지역은 개인화의 결과물이므로 캡션이 아니라 정보로 다룬다. */}
      <figcaption className="flex flex-col gap-1">
        <span className="text-ink-3 text-cap font-normal">이번 달 추천</span>
        <span className="text-title-3 text-ink">
          {lead.title}
          {remaining > 0 && <span className="text-ink-2"> 외 {remaining}곳</span>}
        </span>
      </figcaption>
    </figure>
  );
}
