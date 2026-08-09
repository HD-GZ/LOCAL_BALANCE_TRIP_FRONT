"use client";

import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/features/home/queries";
import type { HomeFeedItem, SavedCourseStatus } from "@/features/home/types";
import HomeCourseCard from "./HomeCourseCard";
import HomeSectionState from "./HomeSectionState";
import SectionHeader from "./SectionHeader";

const STATUS_LABEL: Record<SavedCourseStatus, string> = {
  BEFORE_TRIP: "저장",
  TRAVELING: "여행 중",
  COMPLETED: "완주",
};

function isSavedCourseStatus(value: string): value is SavedCourseStatus {
  return Object.hasOwn(STATUS_LABEL, value);
}

function toStatusLabel(subtitle: string | null) {
  if (!subtitle) {
    return null;
  }

  return isSavedCourseStatus(subtitle) ? STATUS_LABEL[subtitle] : subtitle;
}

function FeedCard({ item }: { item: HomeFeedItem }) {
  if (item.itemType === "SAVED_COURSE") {
    const statusLabel = toStatusLabel(item.subtitle);

    return (
      <HomeCourseCard
        href={`/saved-courses/${item.id}`}
        title={item.title}
        imageUrl={item.imageUrl}
        badge={statusLabel ? { label: statusLabel, tone: "solid" } : null}
      />
    );
  }

  return (
    <HomeCourseCard
      href={`/course-recommend/${item.id}?regionName=${encodeURIComponent(item.title)}`}
      title={item.title}
      imageUrl={item.imageUrl}
      badge={{ label: "취향 기반 추천", tone: "outline" }}
      reason={item.subtitle}
    />
  );
}

export default function SavedCourseFeedSection() {
  const feedQuery = useQuery(homeQueries.savedCourses());
  const items = feedQuery.data?.items ?? [];

  return (
    <section className="flex w-full flex-col gap-4.25">
      <SectionHeader
        title="내가 저장한 코스"
        description="저장한 코스 사이에 취향 기반으로 추천된 여행지를 함께 보여드려요"
        moreHref="/saved-courses"
      />
      {feedQuery.isPending && <HomeSectionState message="저장한 코스를 불러오는 중..." />}
      {feedQuery.isError && (
        <HomeSectionState message="저장한 코스를 불러오지 못했어요." tone="error" />
      )}
      {feedQuery.isSuccess && items.length === 0 && (
        <HomeSectionState message="아직 저장한 코스가 없어요. 코스 추천에서 마음에 드는 코스를 저장해 보세요." />
      )}
      {items.length > 0 && (
        <div className="grid w-full grid-cols-4 gap-4">
          {items.map((item) => (
            <FeedCard key={`${item.itemType}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
