"use client";

import { useState } from "react";
import Image from "next/image";

import RouteMarker from "@/assets/routeMarker.svg";
import { cn } from "@/lib/utils";

type ThumbImageProps = {
  src: string | null;
  alt: string;
  className?: string;
};

/** 목록용 썸네일. 사진 위에 아무것도 얹지 않는다 (DESIGN.md §6). */
export default function ThumbImage({ src, alt, className }: ThumbImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <span
      className={cn(
        "border-line bg-paper-sunk relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-md border",
        className,
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="72px"
          className="lift-zoom object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <RouteMarker className="text-ink-3 size-7" aria-hidden />
      )}
    </span>
  );
}
