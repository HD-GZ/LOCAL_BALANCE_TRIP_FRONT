import type { ProfileSlider } from "@/features/home/types";
import { cn } from "@/lib/utils";

const MIN_SCORE = 1;
const MAX_SCORE = 5;

function clampScore(score: number) {
  return Math.min(Math.max(score, MIN_SCORE), MAX_SCORE);
}

/** 1~5 점수를 트랙 위 위치(%)로 변환한다. */
function toTrackPercent(score: number) {
  return ((clampScore(score) - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
}

function toCaption({ minLabel, maxLabel, score }: ProfileSlider) {
  switch (clampScore(score)) {
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

const labelClassName = "text-[12.5px]";
const activeLabelClassName = "font-semibold text-[#2F6F4F]";
const inactiveLabelClassName = "font-medium text-[#928D84]";

export default function PreferenceSlider({ slider }: { slider: ProfileSlider }) {
  const score = clampScore(slider.score);

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
        className="relative h-2 w-full rounded-full border border-[#C4DDCD] bg-white/85"
        role="meter"
        aria-label={`${slider.minLabel} - ${slider.maxLabel}`}
        aria-valuemin={MIN_SCORE}
        aria-valuemax={MAX_SCORE}
        aria-valuenow={score}
      >
        <span
          className="absolute top-1/2 size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-white bg-[#2F6F4F] shadow-[0_1px_4px_0_rgba(40,36,28,0.22)]"
          style={{ left: `${toTrackPercent(score)}%` }}
        />
      </div>
      <p className="text-[11px] leading-[16.5px] text-[#928D84]">{toCaption(slider)}</p>
    </div>
  );
}
