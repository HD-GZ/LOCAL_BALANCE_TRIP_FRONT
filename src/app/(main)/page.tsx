"use client";

import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/features/home/queries";
import { userQueries } from "@/features/user/queries";
import HomeHero from "./_components/HomeHero";
import IncentiveSection from "./_components/IncentiveSection";
import PopularCourseSection from "./_components/PopularCourseSection";
import ProfileSummary, { toProfileNickname } from "./_components/ProfileSummary";
import ProfileTypeStrip from "./_components/ProfileTypeStrip";
import SavedCourseFeedSection from "./_components/SavedCourseFeedSection";

const UNDIAGNOSED_CTA = {
  label: "취향 진단 시작하기",
  href: "/propensity?step=1",
  caption: "3단계 · 1분이면 충분해요",
};

export default function Home() {
  const meQuery = useQuery(userQueries.me());
  const isLoggedIn = meQuery.isSuccess;
  const profileSummaryQuery = useQuery(homeQueries.profileSummary(isLoggedIn));
  /** 로그아웃 직후 남아 있는 진단 요약 캐시로 로그인 화면이 보이지 않도록 로그인 상태로 한 번 더 가린다. */
  const summary = isLoggedIn ? profileSummaryQuery.data : undefined;
  const heroQuery = useQuery(homeQueries.hero());
  const profileTypesQuery = useQuery(homeQueries.profileTypes(!summary));

  const heroItems = heroQuery.data?.items ?? [];
  const cta = summary
    ? {
        label: "추천 코스 보기",
        href: "/course-recommend?step=1",
        caption: `${toProfileNickname(summary.type)}과 잘 맞는 코스를 추렸어요`,
      }
    : UNDIAGNOSED_CTA;

  return (
    <main className="flex w-full flex-1 justify-center pt-6.5 pb-10">
      <div className="flex w-320 max-w-full flex-col gap-16.5 px-4">
          <HomeHero
            ctaLabel={cta.label}
            ctaHref={cta.href}
            ctaCaption={cta.caption}
            heroItems={heroItems}
            recommendedRegionName={heroItems[0]?.title}
          >
            {summary && meQuery.data ? (
              <ProfileSummary userName={meQuery.data.name} summary={summary} />
            ) : (
              <ProfileTypeStrip
                types={profileTypesQuery.data?.types ?? []}
                isPending={profileTypesQuery.isPending}
                isError={profileTypesQuery.isError}
              />
            )}
          </HomeHero>
        {summary ? <SavedCourseFeedSection /> : <PopularCourseSection />}
        <IncentiveSection />
      </div>
    </main>
  );
}
