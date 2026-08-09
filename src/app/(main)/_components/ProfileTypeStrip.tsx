"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import type { ProfileType } from "@/features/home/types";
import HomeSectionState from "./HomeSectionState";

const PROPENSITY_HREF = "/propensity?step=1";

function ProfileTypeIcon({ type }: { type: ProfileType }) {
  const [hasError, setHasError] = useState(false);

  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-[#E7F0EA]">
      {type.imageUrl && !hasError ? (
        <Image
          src={type.imageUrl}
          alt=""
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Compass className="size-4.5 text-[#2F6F4F]" />
      )}
    </span>
  );
}

type ProfileTypeStripProps = {
  types: ProfileType[];
  isPending: boolean;
  isError: boolean;
};

export default function ProfileTypeStrip({ types, isPending, isError }: ProfileTypeStripProps) {
  return (
    <div className="flex w-full flex-col gap-3.75">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#1C4631]">
          나는 어떤 여행자일까?
        </h2>
        <p className="text-[13px] text-[#5F5B53]">
          카드를 누르면 바로 취향 진단으로 이어집니다
        </p>
      </div>
      {isPending && <HomeSectionState message="여행자 유형을 불러오는 중..." />}
      {isError && <HomeSectionState message="여행자 유형을 불러오지 못했어요." tone="error" />}
      {!isPending && !isError && types.length === 0 && (
        <HomeSectionState message="표시할 여행자 유형이 아직 없어요." />
      )}
      {types.length > 0 && (
        <div className="relative w-full">
          <div className="flex w-full gap-3 overflow-x-auto pb-1">
            {types.map((type) => (
              <Link
                key={type.code}
                href={PROPENSITY_HREF}
                className="flex h-29.5 w-52.5 shrink-0 flex-col items-start gap-3 rounded-[14px] border border-[#C4DDCD] bg-white/90 p-4"
              >
                <ProfileTypeIcon type={type} />
                <span className="flex flex-col gap-0.75">
                  <span className="text-[15px] font-semibold tracking-[-0.225px] text-[#222019]">
                    {type.nickname}
                  </span>
                  <span className="line-clamp-1 text-[12.5px] text-[#928D84]">
                    {type.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 w-13 bg-linear-to-r from-[#F7F1E4]/0 to-72% to-[#F7F1E4]/94" />
        </div>
      )}
    </div>
  );
}
