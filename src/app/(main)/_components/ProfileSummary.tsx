import Link from "next/link";
import { RotateCcw } from "lucide-react";

import Axis from "@/components/common/Axis";
import type { ProfileSummaryResponse } from "@/features/home/types";

export function toProfileNickname(type: string) {
  return type.replace(/\s*\([^)]*\)\s*$/, "").trim() || type;
}

function toDiagnosedDate(diagnosedAt: string) {
  return diagnosedAt.replaceAll("-", ".");
}

function toCaption({
  minLabel,
  maxLabel,
  score,
}: {
  minLabel: string;
  maxLabel: string;
  score: number;
}) {
  switch (Math.min(Math.max(score, 1), 5)) {
    case 1:
      return `${minLabel} 쪽에 가까워요`;
    case 2:
      return `${minLabel} 쪽을 조금 더 좋아해요`;
    case 4:
      return `${maxLabel} 쪽을 조금 더 좋아해요`;
    case 5:
      return `${maxLabel} 쪽에 가까워요`;
    default:
      return "양쪽이 반반이에요";
  }
}

type ProfileSummaryProps = {
  userName: string;
  summary: ProfileSummaryResponse;
};

/**
 * 진단자의 프로필 밴드. 서명 장치인 축(Axis)이 이 표면에서 가장 크게 드러나는 자리다.
 * 카드로 띄우지 않고 위아래 헤어라인으로만 묶는다 (DESIGN.md §6 규칙 3).
 */
export default function ProfileSummary({ userName, summary }: ProfileSummaryProps) {
  return (
    <section className="border-line flex w-full flex-col gap-6 border-y py-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-ink-3 text-cap flex items-center gap-2 font-normal">
            {userName}님의 여행 성향
            <span aria-hidden className="bg-line h-3 w-px" />
            <span className="tabular-nums">진단 {toDiagnosedDate(summary.diagnosedAt)}</span>
          </p>
          <h2 className="text-title-1 text-ink">{toProfileNickname(summary.type)}</h2>
          <p className="text-ink-2 text-body-sm max-w-[52ch]">{summary.description}</p>
        </div>
        <Link
          href="/propensity?step=1"
          className="press border-line-control text-ink text-body-sm hover:bg-surface-2 flex h-9 shrink-0 items-center gap-1.5 rounded-sm border px-3 font-semibold"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.75} />
          다시 진단하기
        </Link>
      </div>

      {/* 축은 가로 한 줄로 나란히 둔다. 한눈에 비교하는 것이 이 밴드의 목적이다.
          열 수를 고정하지 않는 이유: 축 개수는 API가 정한다(3개일 때 5열이면 40%가 빈다).
          auto-fit 이 빈 트랙을 접어서 실제 개수만큼만 열을 만들고 폭을 나눠 준다. */}
      {summary.sliders.length > 0 && (
        <ul className="grid [grid-template-columns:repeat(auto-fit,minmax(min(13rem,100%),1fr))] gap-x-8 gap-y-5">
          {summary.sliders.map((slider) => (
            <li key={slider.key} className="min-w-0">
              <Axis
                minLabel={slider.minLabel}
                maxLabel={slider.maxLabel}
                score={slider.score}
                description={toCaption(slider)}
                showDescription
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
