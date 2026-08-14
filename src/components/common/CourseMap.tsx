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

/**
 * 코스 전체 동선을 한 장에 그리는 지도.
 *
 * 이전에는 장소마다 160px 지도가 아코디언 안에 하나씩 들어 있었다. 그러면 "이 코스가
 * 어떻게 이어지는지"를 볼 수 없다 — 동선이 이 제품의 핵심인데 동선이 안 보였다.
 * 데스크톱에서는 목록 옆에 이 지도를 붙여 목록과 지도가 서로를 가리킨다.
 *
 * 마커는 축(Axis) 마커와 같은 형태(브랜드 점 + 링)를 쓰고, 선택된 장소만 크게 열린다.
 */

export type CourseMapPlace = {
  order: number;
  name: string;
  latitude: number;
  longitude: number;
};

type CourseMapProps = {
  places: CourseMapPlace[];
  activeOrder: number | null;
  onSelect?: (order: number) => void;
  className?: string;
};

function markerHtml({
  order,
  isActive,
  brand,
  ring,
  onBrand,
}: {
  order: number;
  isActive: boolean;
  brand: string;
  ring: string;
  onBrand: string;
}) {
  const size = isActive ? 30 : 22;
  const font = isActive ? 13 : 11;

  return `<span style="
    display:flex;align-items:center;justify-content:center;
    width:${size}px;height:${size}px;border-radius:9999px;
    background:${brand};color:${onBrand};
    border:3px solid ${ring};
    font-size:${font}px;font-weight:600;line-height:1;
    font-variant-numeric:tabular-nums;
    box-shadow:0 1px 4px rgb(34 32 25 / 0.35);
    cursor:pointer;
  ">${order}</span>`;
}

export default function CourseMap({ places, activeOrder, onSelect, className }: CourseMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const pathRef = useRef<naver.maps.Polyline | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  /**
   * 지도 인스턴스는 ref 에 담기므로 그 자체로는 리렌더를 일으키지 않는다.
   * 마커 effect 가 "지도가 준비됨"을 감지할 수 있도록 state 로 따로 신호를 둔다.
   * 이게 없으면 스크립트가 늦게 준비될 때 마커가 한 번도 그려지지 않는다.
   */
  const [isMapReady, setIsMapReady] = useState(false);

  // 지도와 경로선은 장소 목록이 바뀔 때만 다시 만든다.
  useEffect(() => {
    if (!isScriptReady || !mapElementRef.current || places.length === 0) return;

    const { maps } = window.naver;
    const points = places.map((place) => new maps.LatLng(place.latitude, place.longitude));

    const map = new maps.Map(mapElementRef.current, {
      center: points[0]!,
      zoom: 13,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
    });
    mapRef.current = map;
    setIsMapReady(true);

    const rootStyle = getComputedStyle(document.documentElement);
    const brand = rootStyle.getPropertyValue("--brand").trim() || "#2F6F4F";

    pathRef.current = new maps.Polyline({
      map,
      path: points,
      strokeColor: brand,
      strokeWeight: 3,
      strokeOpacity: 0.7,
      strokeStyle: "shortdash",
    });

    // 모든 장소가 한눈에 들어오게 맞춘다. 한 곳뿐이면 그 지점을 확대한다.
    if (points.length > 1) {
      const bounds = points.reduce(
        (acc, point) => acc.extend(point),
        new maps.LatLngBounds(points[0]!, points[0]!),
      );
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
    } else {
      map.setZoom(16);
    }

    return () => {
      pathRef.current?.setMap(null);
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      pathRef.current = null;
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, [isScriptReady, places]);

  // 마커는 지도가 준비된 뒤, 그리고 선택 상태가 바뀔 때마다 다시 그린다.
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map || places.length === 0) return;

    const { maps } = window.naver;
    const rootStyle = getComputedStyle(document.documentElement);
    const brand = rootStyle.getPropertyValue("--brand").trim() || "#2F6F4F";
    const ring = rootStyle.getPropertyValue("--surface").trim() || "#FFFFFF";
    const onBrand = rootStyle.getPropertyValue("--brand-on").trim() || "#FFFFFF";

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = places.map((place) => {
      const isActive = place.order === activeOrder;
      const size = isActive ? 30 : 22;
      const marker = new maps.Marker({
        map,
        position: new maps.LatLng(place.latitude, place.longitude),
        title: place.name,
        zIndex: isActive ? 100 : 10,
        icon: {
          content: markerHtml({ order: place.order, isActive, brand, ring, onBrand }),
          anchor: new maps.Point(size / 2 + 3, size / 2 + 3),
        },
      });

      if (onSelect) {
        maps.Event.addListener(marker, "click", () => onSelect(place.order));
      }

      return marker;
    });
  }, [isMapReady, places, activeOrder, onSelect]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div
        ref={mapElementRef}
        role="img"
        aria-label={`코스 동선 지도. 장소 ${places.length}곳`}
        className={cn("border-line bg-paper-sunk overflow-hidden rounded-md border", className)}
      />
    </>
  );
}
