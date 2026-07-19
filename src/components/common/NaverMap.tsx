/// <reference types="navermaps" />
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { NAVER_MAP_CLIENT_ID } from "@/lib/config/client";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    naver: typeof naver;
  }
}

type NaverMapProps = {
  latitude: number;
  longitude: number;
  className?: string;
};

export default function NaverMap({ latitude, longitude, className }: NaverMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    if (!isScriptReady || !mapElementRef.current) return;

    const center = new window.naver.maps.LatLng(latitude, longitude);
    const map = new window.naver.maps.Map(mapElementRef.current, {
      center,
      zoom: 16,
    });

    new window.naver.maps.Marker({ position: center, map });
  }, [isScriptReady, latitude, longitude]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div ref={mapElementRef} className={cn("rounded-xl", className)} />
    </>
  );
}
