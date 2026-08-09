import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProfileSummaryResponse } from "@/features/home/types";
import PreferenceSlider from "./PreferenceSlider";

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
    <div className="flex w-full flex-col gap-3.75">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#1C4631]">
          {userName}님의 여행 성향
        </h2>
        <p className="text-[13px] text-[#5F5B53]">
          진단 결과를 바탕으로 아래 코스와 혜택을 추천해 드려요
        </p>
        <Link
          href="/propensity?step=1"
          className="ml-auto flex shrink-0 items-center gap-0.5 text-[13.5px] font-semibold text-[#2F6F4F]"
        >
          다시 진단하기
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid w-full grid-cols-[0.6fr_1.4fr] items-center gap-8">
        <div className="flex flex-col items-start gap-2">
          <span className="flex h-6.75 items-center rounded-full border border-[#C4DDCD] bg-white/85 px-3.25 text-[12px] font-semibold text-[#1C4631]">
            진단 완료 · {toDiagnosedDate(summary.diagnosedAt)}
          </span>
          <p className="text-[25px] leading-[30px] font-bold tracking-[-0.75px] text-[#1C4631]">
            {toProfileNickname(summary.type)}
          </p>
          <p className="text-[13.5px] leading-[21.6px] text-[#5F5B53]">{summary.description}</p>
        </div>
        <div className="flex items-start justify-center gap-4">
          {summary.sliders.map((slider) => (
            <PreferenceSlider key={slider.key} slider={slider} />
          ))}
        </div>
      </div>
    </div>
  );
}
