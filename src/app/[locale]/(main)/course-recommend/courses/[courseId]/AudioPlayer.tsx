"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * 오디오 가이드. DESIGN.md §3 예외 — 재생 진행은 실제 "충전량"이므로
 * 이 표면에서 유일하게 채워지는 트랙이다.
 *
 * 이전 구현은 진행 바를 보여주기만 했다. 탐색 가능한 range 로 바꿨다.
 */

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export default function AudioPlayer({ src }: { src: string }) {
  const t = useTranslations("courseRecommend.audioPlayer");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border-line bg-surface-2 flex w-full max-w-90 items-center gap-3 rounded-full border py-1.5 pr-4 pl-1.5">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? t("pause") : t("play")}
        className="press bg-brand hover:bg-brand-hover text-brand-on flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
      >
        {isPlaying ? (
          <Pause className="size-3.5 fill-current" strokeWidth={0} />
        ) : (
          <Play className="size-3.5 translate-x-px fill-current" strokeWidth={0} />
        )}
      </button>

      <label className="relative flex flex-1 items-center">
        <span className="sr-only">{t("seekPosition")}</span>
        <span
          aria-hidden
          className="bg-line-control/60 pointer-events-none absolute inset-x-0 h-1 rounded-full"
        >
          <span className="bg-brand block h-full rounded-full" style={{ width: `${progress}%` }} />
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(event) => handleSeek(Number(event.target.value))}
          disabled={!duration}
          className="[&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:border-surface [&::-moz-range-thumb]:bg-brand [&::-moz-range-thumb]:border-surface relative w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2"
        />
      </label>

      <span className="text-ink-2 text-cap shrink-0 tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
