"use client";

import { useState } from "react";
import Image from "next/image";
import RouteMarker from "@/assets/routeMarker.svg";

type ThumbImageProps = {
  src: string | null;
  alt: string;
};

export default function ThumbImage({ src, alt }: ThumbImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <span className="relative flex size-19 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#E2EFE7]">
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="76px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <RouteMarker className="size-8" />
      )}
    </span>
  );
}
