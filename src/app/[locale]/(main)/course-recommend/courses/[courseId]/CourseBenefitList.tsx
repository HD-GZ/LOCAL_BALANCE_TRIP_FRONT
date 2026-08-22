"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CourseBenefit } from "@/features/recommendation/types";

/**
 * 코스 적용 혜택. 홈의 혜택 장부와 같은 행 형태를 공유한다 (DESIGN.md §6 규칙 3).
 * 행마다 위아래 테두리를 다 두르지 않고 divide-y 로만 나눈다.
 */
export default function CourseBenefitList({ benefits }: { benefits: CourseBenefit[] }) {
  const t = useTranslations("courseRecommend.benefitList");

  if (benefits.length === 0) {
    return (
      // 구분선은 뒤따르는 블록이 갖고 있다. 여기서 또 두르면 괘선이 겹치고
      // 사이에 죽은 공간이 생긴다.
      <p className="text-ink-3 text-body-sm">{t("empty")}</p>
    );
  }

  return (
    <ul className="border-line divide-line flex w-full flex-col divide-y border-t">
      {benefits.map((benefit) => (
        <li key={benefit.title}>
          <a
            href={benefit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:bg-surface-2 -mx-3 flex flex-col gap-1 rounded-sm px-3 py-3.5 transition-colors duration-(--dur-1)"
          >
            <span className="text-title-3 text-ink group-hover:text-brand-ink flex items-center gap-1.5 transition-colors duration-(--dur-1)">
              <span className="min-w-0">{benefit.title}</span>
              <ArrowUpRight
                aria-hidden
                strokeWidth={1.75}
                className="text-ink-3 group-hover:text-brand-ink size-3.5 shrink-0 transition-all duration-(--dur-2) group-hover:translate-x-px group-hover:-translate-y-px"
              />
            </span>
            {benefit.description && (
              <span className="text-ink-2 text-body-sm">{benefit.description}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
