"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import type { ProfileType } from "@/features/home/types";

const PROPENSITY_HREF = "/propensity?step=1";

function TypeThumb({ type }: { type: ProfileType }) {
  const [hasError, setHasError] = useState(false);

  return (
    <span className="border-line bg-paper-sunk relative block aspect-square w-full overflow-hidden rounded-sm border">
      {type.imageUrl && !hasError && (
        <Image
          src={type.imageUrl}
          alt=""
          fill
          sizes="120px"
          className="lift-zoom object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </span>
  );
}

type ProfileTypeStripProps = {
  types: ProfileType[];
  isPending: boolean;
  isError: boolean;
};

/**
 * 비진단자용. 가로 스크롤 스냅 열 — 이 표면에서 카드 그리드와 구분되는 레이아웃 계열이다
 * (DESIGN.md §11, 섹션 계열 반복 금지).
 */
export default function ProfileTypeStrip({ types, isPending, isError }: ProfileTypeStripProps) {
  return (
    <section className="border-line flex w-full flex-col gap-5 border-y py-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-title-1 text-ink">나는 어떤 여행자일까</h2>
        <p className="text-ink-2 text-body-sm">
          카드를 누르면 바로 취향 진단으로 이어져요. 10개 축에 답하면 내 유형이 나와요.
        </p>
      </div>

      {isPending && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex w-30 shrink-0 flex-col gap-2.5">
              <Skeleton className="aspect-square w-full" rounded="sm" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <SurfaceState
          tone="error"
          title="여행자 유형을 불러오지 못했어요"
          description="잠시 후 다시 시도해 주세요. 진단은 지금 바로 시작할 수 있어요."
          action={{ label: "취향 진단 시작하기", href: PROPENSITY_HREF }}
        />
      )}

      {!isPending && !isError && types.length === 0 && (
        <SurfaceState
          title="표시할 여행자 유형이 아직 없어요"
          description="유형 목록은 준비 중이지만, 진단 자체는 지금 받을 수 있어요."
          action={{ label: "취향 진단 시작하기", href: PROPENSITY_HREF }}
        />
      )}

      {types.length > 0 && (
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
          {types.map((type) => (
            <li key={type.code} className="w-30 shrink-0 snap-start sm:w-34">
              <Link
                href={PROPENSITY_HREF}
                className="lift group flex flex-col gap-2.5 rounded-sm border border-transparent"
              >
                <TypeThumb type={type} />
                <span className="flex flex-col gap-1">
                  <span className="text-title-3 text-ink group-hover:text-brand-ink transition-colors duration-(--dur-1)">
                    {type.nickname}
                  </span>
                  <span className="text-ink-3 text-cap line-clamp-2 font-normal">
                    {type.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
