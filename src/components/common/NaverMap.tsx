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

    /**
     * 기본 마커는 네이버의 빨간 핀이라 이 표면에서 유일하게 팔레트 밖 색이 된다.
     * 축(Axis)의 위치 마커와 같은 형태(브랜드 점 + 링)로 맞춰 서명 장치를 재사용한다.
     * 색은 런타임에 CSS 변수에서 읽어 다크모드도 따라간다.
     */
    const rootStyle = getComputedStyle(document.documentElement);
    const brand = rootStyle.getPropertyValue("--brand").trim() || "#2F6F4F";
    const ring = rootStyle.getPropertyValue("--surface").trim() || "#FFFFFF";

    new window.naver.maps.Marker({
      position: center,
      map,
      icon: {
        content: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${brand};border:3px solid ${ring};box-shadow:0 1px 3px rgb(34 32 25 / 0.35)"></span>`,
        anchor: new window.naver.maps.Point(10, 10),
      },
    });
  }, [isScriptReady, latitude, longitude]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div ref={mapElementRef} className={cn("bg-paper-sunk rounded-md", className)} />
    </>
  );
}
