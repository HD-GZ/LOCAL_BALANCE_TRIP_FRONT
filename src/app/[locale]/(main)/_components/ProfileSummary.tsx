import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { ProfileSummaryResponse } from "@/features/home/types";

import PreferenceSlider from "./PreferenceSlider";

/**
 * 홈 프로필 밴드. 기존 디자인(develop)의 구성으로 되돌렸다 — 팀 합의 사항.
 * 히어로 하단에 들어가고, 좌측에 유형 요약 / 우측에 성향 슬라이더가 놓인다.
 *
 * 팀 피드백의 "여행 프로필 크기 키운 게 좋다"는 취향진단 결과 화면을 가리킨 것이라
 * 그쪽 크기는 유지하고 이 밴드는 원래 형태로 돌렸다.
 */

export function toProfileNickname(type: string) {
  return type.replace(/\s*\([^)]*\)\s*$/, "").trim() || type;
}

function toDiagnosedDate(diagnosedAt: string) {
  return diagnosedAt.replaceAll("-", ".");
}

type ProfileSummaryProps = {
  userName: string;
  summary: ProfileSummaryResponse;
};

export default function ProfileSummary({ userName, summary }: ProfileSummaryProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-title-3 text-brand-ink">{userName}님의 여행 성향</h2>
        <p className="text-ink-2 text-body-sm">
          진단 결과를 바탕으로 아래 코스와 혜택을 추천해 드려요
        </p>
        <Link
          href="/propensity?step=1"
          className="text-brand-ink text-body-sm ml-auto flex shrink-0 items-center gap-0.5 font-semibold"
        >
          다시 진단하기
          <ChevronRight className="size-3.5" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <div className="grid w-full items-center gap-6 lg:grid-cols-[0.6fr_1.4fr] lg:gap-8">
        <div className="flex flex-col items-start gap-2">
          <span className="border-brand-line bg-surface/85 text-brand-ink text-cap flex h-6.5 items-center gap-1 rounded-full border px-3">
            진단 완료 ·<span className="tabular-nums">{toDiagnosedDate(summary.diagnosedAt)}</span>
          </span>
          <p className="text-title-1 text-brand-ink">{toProfileNickname(summary.type)}</p>
          <p className="text-ink-2 text-body-sm">{summary.description}</p>
        </div>

        {summary.sliders.length > 0 && (
          <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
            {summary.sliders.map((slider) => (
              <PreferenceSlider key={slider.key} slider={slider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
