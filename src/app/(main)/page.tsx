"use client";

import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/features/home/queries";
import { userQueries } from "@/features/user/queries";
import { isApiError } from "@/lib/api/error";
import HomeHero from "./_components/HomeHero";
import HomeSectionState from "./_components/HomeSectionState";
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

const SUMMARY_ERROR_MESSAGE = "여행 성향을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";

type HomeState = "loading" | "error" | "diagnosed" | "undiagnosed";

function resolveHomeState({
  isResolved,
  hasFailure,
  hasSummary,
}: {
  isResolved: boolean;
  hasFailure: boolean;
  hasSummary: boolean;
}): HomeState {
  if (!isResolved) {
    return "loading";
  }

  if (hasFailure) {
    return "error";
  }

  return hasSummary ? "diagnosed" : "undiagnosed";
}

export default function Home() {
  const meQuery = useQuery(userQueries.me());
  const isLoggedIn = meQuery.isSuccess;
  const profileSummaryQuery = useQuery(homeQueries.profileSummary(isLoggedIn));
  const summary = isLoggedIn ? profileSummaryQuery.data : undefined;

  const isSummaryResolved =
    !isLoggedIn || profileSummaryQuery.isSuccess || profileSummaryQuery.isError;
  const isUndiagnosed =
    isApiError(profileSummaryQuery.error) && profileSummaryQuery.error.status === 404;
  const hasSummaryFailure = profileSummaryQuery.isError && !isUndiagnosed;

  const homeState = resolveHomeState({
    isResolved: !meQuery.isPending && isSummaryResolved,
    hasFailure: hasSummaryFailure,
    hasSummary: Boolean(summary),
  });

  const heroQuery = useQuery(homeQueries.hero());
  const profileTypesQuery = useQuery(homeQueries.profileTypes(homeState === "undiagnosed"));

  const heroItems = heroQuery.data?.items ?? [];
  const cta =
    homeState === "diagnosed" && summary
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
          {homeState === "loading" && <HomeSectionState message="여행 성향을 불러오는 중..." />}
          {homeState === "error" && (
            <HomeSectionState message={SUMMARY_ERROR_MESSAGE} tone="error" />
          )}
          {homeState === "diagnosed" && summary && meQuery.data && (
            <ProfileSummary userName={meQuery.data.name} summary={summary} />
          )}
          {homeState === "undiagnosed" && (
            <ProfileTypeStrip
              types={profileTypesQuery.data?.types ?? []}
              isPending={profileTypesQuery.isPending}
              isError={profileTypesQuery.isError}
            />
          )}
        </HomeHero>
        {homeState === "loading" && <HomeSectionState message="코스를 불러오는 중..." />}
        {homeState === "error" && <HomeSectionState message={SUMMARY_ERROR_MESSAGE} tone="error" />}
        {homeState === "diagnosed" && <SavedCourseFeedSection />}
        {homeState === "undiagnosed" && <PopularCourseSection />}
        <IncentiveSection />
      </div>
    </main>
  );
}
