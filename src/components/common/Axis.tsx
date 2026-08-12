"use client";

import { cn } from "@/lib/utils";

/**
 * 축(Axis) — 이 제품의 서명 장치. DESIGN.md §6.
 *
 * 값은 "얼마나 찼는지"가 아니라 "어디에 서 있는지"다. 그래서 채워진 진행 바가
 * 아니라 헤어라인 위의 위치 표식으로 그린다. 성향 5축, 가치소비 5항목,
 * 홈 프로필 요약이 모두 이 형태를 공유한다.
 *
 * 한 축은 [양극 라벨] / [트랙] / [해석 문장] 3단으로 쌓이고, 축들은 **가로로 나란히**
 * 놓인다. 다섯 축을 한눈에 비교하는 것이 이 장치의 목적이기 때문이다.
 *
 * 트랙은 눈금이 있는 자(scale)이므로 장식이 아니다. `--line`(paper 대비 1.09:1)로는
 * 보이지 않아 `--line-control`(3.11:1)을 쓴다 (DESIGN.md §3).
 */

const MIN = 1;
const MAX = 5;
const STEPS = [1, 2, 3, 4, 5];

function clamp(score: number) {
  return Math.min(Math.max(score, MIN), MAX);
}

function toPercent(score: number) {
  return ((clamp(score) - MIN) / (MAX - MIN)) * 100;
}

/** 눈금 5개 + 위치 마커. */
function AxisTrack({ score }: { score: number }) {
  return (
    <span className="flex h-3 min-w-16 flex-1 items-center">
      {/* 마커 반지름(6px)만큼 좌우를 물려 양 끝 값에서도 마커가 잘리지 않는다. */}
      <span className="relative mx-1.5 block h-3 flex-1">
        <span aria-hidden className="bg-line-control absolute inset-x-0 top-1/2 h-px" />
        <span aria-hidden className="absolute inset-0 flex items-center justify-between">
          {STEPS.map((step) => (
            <span key={step} className={cn("bg-line-control w-px", step === 3 ? "h-2" : "h-1.5")} />
          ))}
        </span>
        <span
          aria-hidden
          className="axis-marker bg-brand border-paper absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{ left: `${toPercent(score)}%` }}
        />
      </span>
    </span>
  );
}

const labelBase = "min-w-0 transition-colors duration-(--dur-2)";

type AxisProps = {
  minLabel: string;
  maxLabel: string;
  score: number;
  /** 해석 문장. 항상 aria-valuetext 로 읽히고, showDescription 일 때만 눈에 보인다. */
  description?: string;
  showDescription?: boolean;
  size?: "sm" | "md";
  className?: string;
};

/** 읽기 전용 축. 홈 프로필 요약, 진단 결과에서 사용. */
export default function Axis({
  minLabel,
  maxLabel,
  score,
  description,
  showDescription = false,
  size = "sm",
  className,
}: AxisProps) {
  const value = clamp(score);
  const text = size === "md" ? "text-body-sm" : "text-cap";

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div
        className="flex min-w-0 flex-col gap-2"
        role="meter"
        aria-label={`${minLabel} 대 ${maxLabel}`}
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-valuetext={description}
      >
        {/*
         * 라벨 영역 높이를 2행으로 고정한다. 축을 여러 개 나란히 놓을 때 어떤 라벨은
         * 한 줄, 어떤 라벨은 두 줄이 되는데, 높이를 고정하지 않으면 트랙들이 서로
         * 다른 높이에 놓여 눈금이 어긋나 보인다.
         * items-end 라서 한 줄 라벨은 트랙에 붙고, 여유 높이는 위로 남는다.
         */}
        <div className={cn(text, "flex min-h-[2.7em] items-end justify-between gap-3")}>
          <span
            className={cn(
              labelBase,
              value < 3 ? "text-brand-ink font-semibold" : "text-ink-2 font-medium",
            )}
          >
            {minLabel}
          </span>
          <span
            className={cn(
              labelBase,
              "text-right",
              value > 3 ? "text-brand-ink font-semibold" : "text-ink-2 font-medium",
            )}
          >
            {maxLabel}
          </span>
        </div>
        <AxisTrack score={value} />
      </div>
      {showDescription && description && (
        <p className="text-ink-3 text-cap font-normal">{description}</p>
      )}
    </div>
  );
}

type AxisInputProps = {
  minLabel: string;
  maxLabel: string;
  /** 0 = 미응답 */
  value: number;
  onChange: (score: number) => void;
  /** 각 극의 부제. 예: "유명·인기 명소" */
  minHint?: string;
  maxHint?: string;
};

/**
 * 응답용 축. 5개 단계를 라디오 그룹으로 노출한다.
 * 터치 타깃은 44px 이상 확보한다 (DESIGN.md §8).
 */
export function AxisInput({
  minLabel,
  maxLabel,
  value,
  onChange,
  minHint,
  maxHint,
}: AxisInputProps) {
  const answered = value >= MIN && value <= MAX;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <span className="flex min-w-0 flex-col gap-0.5 text-left">
          <span
            className={cn(
              "text-body-sm transition-colors duration-(--dur-2)",
              answered && value < 3 ? "text-brand-ink font-semibold" : "text-ink-2 font-medium",
            )}
          >
            {minLabel}
          </span>
          {minHint && <span className="text-ink-3 text-cap font-normal">{minHint}</span>}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5 text-right">
          <span
            className={cn(
              "text-body-sm transition-colors duration-(--dur-2)",
              answered && value > 3 ? "text-brand-ink font-semibold" : "text-ink-2 font-medium",
            )}
          >
            {maxLabel}
          </span>
          {maxHint && <span className="text-ink-3 text-cap font-normal">{maxHint}</span>}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label={`${minLabel} 대 ${maxLabel}`}
        className="relative flex items-center justify-between"
      >
        <span
          aria-hidden
          className="bg-line-control absolute inset-x-5.5 top-1/2 h-px -translate-y-1/2"
        />
        {STEPS.map((step) => {
          const isSelected = value === step;
          const isCenter = step === 3;

          return (
            <button
              key={step}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={
                isCenter
                  ? "양쪽 반반"
                  : step < 3
                    ? `${minLabel} 쪽 ${3 - step}단계`
                    : `${maxLabel} 쪽 ${step - 3}단계`
              }
              onClick={() => onChange(step)}
              className="group press relative z-10 flex size-11 cursor-pointer items-center justify-center rounded-full"
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-(--dur-2) ease-(--ease-out-quart)",
                  isSelected
                    ? "bg-brand size-6"
                    : cn(
                        "bg-surface border-line-control border",
                        isCenter ? "size-2" : "size-3.5",
                        "group-hover:border-brand group-hover:bg-brand-wash",
                      ),
                )}
              >
                {isSelected && <span className="bg-brand-wash size-2 rounded-full" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
