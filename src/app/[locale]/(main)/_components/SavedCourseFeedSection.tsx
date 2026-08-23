"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import Reveal from "@/components/common/Reveal";
import { SkeletonCard } from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";
import type { HomeFeedItem, SavedCourseStatus } from "@/features/home/types";

import HomeCourseCard from "./HomeCourseCard";
import SectionHeader from "./SectionHeader";

const SAVED_COURSE_STATUSES: SavedCourseStatus[] = ["BEFORE_TRIP", "TRAVELING", "COMPLETED"];

/** subtitle 에 상태 코드가 담겨 온다. 알 수 없는 값이면 배지를 그리지 않는다. */
function toSavedCourseStatus(subtitle: string | null): SavedCourseStatus | null {
  if (!subtitle) return null;
  return SAVED_COURSE_STATUSES.find((status) => status === subtitle) ?? null;
}

function FeedCard({ item }: { item: HomeFeedItem }) {
  const t = useTranslations("home.savedCourseFeed");

  if (item.itemType === "SAVED_COURSE") {
    return (
      <HomeCourseCard
        href={`/saved-courses/${item.id}`}
        title={item.title}
        imageUrl={item.imageUrl}
        status={toSavedCourseStatus(item.subtitle)}
      />
    );
  }

  return (
    <HomeCourseCard
      href={`/course-recommend/${item.id}?regionName=${encodeURIComponent(item.title)}`}
      title={item.title}
      imageUrl={item.imageUrl}
      badge={{ label: t("badgeLabel"), tone: "outline" }}
      reason={item.subtitle}
    />
  );
}

/**
 * 히어로가 이미 사진으로 보여준 지역은 피드에서 뺀다.
 * 두 API 가 같은 추천 지역 목록을 내려주기 때문에, 그대로 두면 한 화면에서 같은 지역이
 * 위(히어로 사진)와 아래(피드 카드)에 두 번 나온다.
 *
 * 히어로 응답에는 id 가 없어 제목으로 맞출 수밖에 없다. 저장 코스는 대상이 아니다 —
 * 지역과 코스는 다른 것이고, 저장 코스가 피드의 본래 내용이다.
 */
function excludeRegionsShownInHero(items: HomeFeedItem[], heroRegionTitles: string[]) {
  if (heroRegionTitles.length === 0) return items;

  const shown = new Set(heroRegionTitles);
  return items.filter((item) => item.itemType !== "RECOMMENDED_REGION" || !shown.has(item.title));
}

export default function SavedCourseFeedSection({
  heroRegionTitles = [],
}: {
  heroRegionTitles?: string[];
}) {
  const t = useTranslations("home.savedCourseFeed");
  const tCommon = useTranslations();
  const feedQuery = useQuery(homeQueries.savedCourses());
  const items = excludeRegionsShownInHero(feedQuery.data?.items ?? [], heroRegionTitles);

  return (
    <section className="flex w-full flex-col gap-5">
      <SectionHeader title={t("title")} description={t("description")} moreHref="/saved-courses" />

      {feedQuery.isPending && (
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {feedQuery.isError && (
        <SurfaceState
          tone="error"
          title={t("error.title")}
          description={t("error.description")}
          action={{ label: tCommon("retry"), onRetry: () => feedQuery.refetch() }}
        />
      )}

      {feedQuery.isSuccess && items.length === 0 && (
        <SurfaceState
          variant="plain"
          title={t("empty.title")}
          description={t("empty.description")}
          action={{ label: t("empty.cta"), href: "/course-recommend?step=1" }}
        />
      )}

      {items.length > 0 && (
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal as="li" key={`${item.itemType}-${item.id}`} index={index}>
              <FeedCard item={item} />
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
