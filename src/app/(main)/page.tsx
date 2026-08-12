"use client";

import { useQuery } from "@tanstack/react-query";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { homeQueries } from "@/features/home/queries";
import { userQueries } from "@/features/user/queries";
import { isApiError } from "@/lib/api/error";

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

/** 프로필 밴드 로딩 자리. 최종 레이아웃(축 5개 행)의 형태를 복제한다. */
function ProfileBandSkeleton() {
  return (
    <div className="border-line flex w-full flex-col gap-6 border-y py-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-3 w-80" />
      </div>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(13rem,100%),1fr))] gap-x-8 gap-y-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex min-h-[2.7em] items-end justify-between gap-3">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-px w-full" rounded="none" />
            <Skeleton className="mt-1 h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
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
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-16 px-4 pt-10 md:px-8 md:pt-16">
        <HomeHero
          ctaLabel={cta.label}
          ctaHref={cta.href}
          ctaCaption={cta.caption}
          heroItems={heroItems}
          isHeroPending={heroQuery.isPending}
        />

        {homeState === "loading" && <ProfileBandSkeleton />}
        {homeState === "error" && (
          <SurfaceState
            tone="error"
            title="여행 성향을 불러오지 못했어요"
            description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
            action={{ label: "다시 시도", onRetry: () => profileSummaryQuery.refetch() }}
          />
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

        {homeState === "diagnosed" && <SavedCourseFeedSection />}
        {homeState !== "diagnosed" && homeState !== "error" && <PopularCourseSection />}

        <IncentiveSection />
      </div>
    </main>
  );
}
