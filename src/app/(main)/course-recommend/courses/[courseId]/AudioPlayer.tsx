"use client";

import { useRef, useState } from "react";
import { Pause } from "lucide-react";
import Play from "@/assets/play.svg";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full max-w-85 items-center gap-3 rounded-full border border-[#EBE7DF] bg-[#F0EDE6] py-2.25 pr-3.25 pl-2.25">
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
        className="flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2F6F4F]"
      >
        {isPlaying ? (
          <Pause className="size-3.75 fill-white stroke-white" />
        ) : (
          <Play className="size-3.75" />
        )}
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#C3BDB3]">
        <div className="h-full rounded-full bg-[#3C875F]" style={{ width: `${progress}%` }} />
      </div>
      <span className="shrink-0 font-mono text-[11px] tracking-[-0.22px] text-[#928D84]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
