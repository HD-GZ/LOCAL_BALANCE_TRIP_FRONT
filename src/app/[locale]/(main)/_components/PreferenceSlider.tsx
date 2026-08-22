"use client";

import { useTranslations } from "next-intl";

import type { ProfileSlider } from "@/features/home/types";
import { cn } from "@/lib/utils";

/**
 * 홈 프로필의 성향 슬라이더. 기존 디자인(develop)의 형태를 되돌린 것이다 — 팀 합의 사항.
 * 흰 트랙 + 초록 마커 + 그림자.
 *
 * 값은 토큰으로 쓴다. 원본의 #928D84 는 paper 대비 2.92:1 이라 캡션을 담을 수 없어
 * ink-3 로 올렸다(4.55:1).
 */

const MIN_SCORE = 1;
const MAX_SCORE = 5;

function clampScore(score: number) {
  return Math.min(Math.max(score, MIN_SCORE), MAX_SCORE);
}

function toTrackPercent(score: number) {
  return ((clampScore(score) - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
}

function toCaption(
  t: ReturnType<typeof useTranslations>,
  { minLabel, maxLabel, score }: ProfileSlider,
) {
  switch (clampScore(score)) {
    case 1:
      return t("closeToMin", { label: minLabel });
    case 2:
      return t("leanMin", { label: minLabel });
    case 4:
      return t("leanMax", { label: maxLabel });
    case 5:
      return t("closeToMax", { label: maxLabel });
    default:
      return t("balanced");
  }
}

const labelClassName = "text-cap whitespace-nowrap";
const activeLabelClassName = "text-brand font-semibold";
const inactiveLabelClassName = "text-ink-3 font-medium";

export default function PreferenceSlider({ slider }: { slider: ProfileSlider }) {
  const t = useTranslations("home.preferenceSlider");
  const score = clampScore(slider.score);
  const caption = toCaption(t, slider);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(labelClassName, score < 3 ? activeLabelClassName : inactiveLabelClassName)}
        >
          {slider.minLabel}
        </span>
        <span
          className={cn(labelClassName, score > 3 ? activeLabelClassName : inactiveLabelClassName)}
        >
          {slider.maxLabel}
        </span>
      </div>

      <div
        className="border-brand-line bg-surface/85 relative h-2 w-full rounded-full border"
        role="meter"
        aria-label={t("ariaLabel", { minLabel: slider.minLabel, maxLabel: slider.maxLabel })}
        aria-valuemin={MIN_SCORE}
        aria-valuemax={MAX_SCORE}
        aria-valuenow={score}
        aria-valuetext={caption}
      >
        <span
          className="border-surface bg-brand axis-marker absolute top-1/2 size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 shadow-[0_1px_4px_0_rgb(40_36_28/0.22)]"
          style={{ left: `${toTrackPercent(score)}%` }}
        />
      </div>

      <p className="text-ink-3 text-cap font-normal">{caption}</p>
    </div>
  );
}
