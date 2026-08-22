"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import type { ProfileType } from "@/features/home/types";
import { Link } from "@/i18n/navigation";

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
  const t = useTranslations("home.profileTypeStrip");

  return (
    <section className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-title-1 text-ink">{t("title")}</h2>
        <p className="text-ink-2 text-body-sm">{t("description")}</p>
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
          title={t("error.title")}
          description={t("error.description")}
          action={{ label: t("error.cta"), href: PROPENSITY_HREF }}
        />
      )}

      {!isPending && !isError && types.length === 0 && (
        <SurfaceState
          variant="plain"
          title={t("empty.title")}
          description={t("empty.description")}
          action={{ label: t("empty.cta"), href: PROPENSITY_HREF }}
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
