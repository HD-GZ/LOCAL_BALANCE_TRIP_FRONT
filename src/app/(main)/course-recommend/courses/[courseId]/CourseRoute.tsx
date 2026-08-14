"use client";

import { useCallback, useState } from "react";

import CourseMap from "@/components/common/CourseMap";
import type { CoursePlace } from "@/features/recommendation/types";

import CourseTimeline, { placeAnchorId } from "./CourseTimeline";

/**
 * 코스 동선의 데스크톱 구성: 목록과 지도가 나란히 서서 서로를 가리킨다.
 *
 * 이 화면이 데스크톱 폭을 쓰는 근거는 "정보가 길어서"가 아니라 **순서와 위치가 서로
 * 참조하는 한 쌍**이기 때문이다. 목록에서 장소를 열면 지도의 해당 마커가 커지고,
 * 지도에서 마커를 누르면 그 장소가 열리며 목록이 그 위치로 스크롤한다.
 *
 * 모바일에서는 지도를 목록 위에 한 장 두고 스크롤로 내려간다. 병렬 구성은 폭이 있을 때만
 * 성립하므로 lg 미만에서는 강요하지 않는다.
 */
export default function CourseRoute({ places }: { places: CoursePlace[] }) {
  const [activeOrder, setActiveOrder] = useState<number | null>(places[0]?.order ?? null);

  const handleToggle = useCallback((order: number) => {
    setActiveOrder((current) => (current === order ? null : order));
  }, []);

  const handleSelectFromMap = useCallback((order: number) => {
    setActiveOrder(order);
    // 지도에서 고른 장소를 목록에서도 보이게 한다. 아니면 선택했는데 화면에 없다.
    document
      .getElementById(placeAnchorId(order))
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const mapPlaces = places.map((place) => ({
    order: place.order,
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-10">
      {/*
       * 모바일은 지도 먼저(전체 그림), 데스크톱은 오른쪽 열로 옮긴다.
       * sticky 는 지도가 아니라 래퍼에 건다. 늘어난 그리드 아이템(stretch) 안에서는
       * sticky 가 움직일 여백이 없으므로 items-start 로 셀 높이를 내용에 맞춘다.
       */}
      <div className="lg:sticky lg:top-24 lg:order-2 lg:self-start">
        <CourseMap
          places={mapPlaces}
          activeOrder={activeOrder}
          onSelect={handleSelectFromMap}
          className="h-64 w-full lg:h-[min(32rem,calc(100dvh-8rem))]"
        />
      </div>
      <div className="lg:order-1">
        <CourseTimeline places={places} expandedOrder={activeOrder} onToggle={handleToggle} />
      </div>
    </div>
  );
}
