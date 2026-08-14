"use client";

import { useQuery } from "@tanstack/react-query";

import FlowShell from "@/components/common/FlowShell";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";

import CourseDestinationList from "./CourseDestinationList";
import { COURSE_STEPS } from "./steps";

function DestinationListSkeleton() {
  return (
    <div className="border-line divide-line flex w-full flex-col divide-y border-y">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="size-16" rounded="md" />
          <span className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-3/4" />
          </span>
        </div>
      ))}
    </div>
  );
}

export default function CourseRecommend() {
  const regionsQuery = useQuery(recommendationQueries.regions());
  const regions = regionsQuery.data ?? [];
  /**
   * 진단을 아직 받지 않은 계정은 401로 돌아온다. 네트워크 오류가 아니라 순서 문제이므로
   * "다시 시도"가 아니라 진단으로 보낸다.
   */
  const needsPropensity = isApiError(regionsQuery.error) && regionsQuery.error.status === 401;

  return (
    <FlowShell
      steps={COURSE_STEPS}
      currentStep={1}
      showStepLabel
      align="start"
      title="성향에 맞는 추천 여행지"
      description="지역을 누르면 맞춤 추천 코스를 볼 수 있어요."
    >
      {regionsQuery.isPending && <DestinationListSkeleton />}

      {regionsQuery.isError &&
        (needsPropensity ? (
          <SurfaceState
            title="취향 진단을 먼저 받아야 해요"
            description="진단을 마치면 성향에 맞는 여행지를 추천해 드려요."
            action={{ label: "취향 진단 하러 가기", href: "/propensity?step=1" }}
          />
        ) : (
          <SurfaceState
            tone="error"
            title="추천 여행지를 불러오지 못했어요"
            description={
              isApiError(regionsQuery.error)
                ? regionsQuery.error.message
                : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
            }
            action={{ label: "다시 시도", onRetry: () => regionsQuery.refetch() }}
          />
        ))}

      {regionsQuery.isSuccess && regions.length === 0 && (
        <SurfaceState
          title="아직 추천된 여행지가 없어요"
          description="취향 진단 결과 화면에서 코스 추천을 받으면 여기에 지역이 채워져요."
          action={{ label: "취향 진단으로 가기", href: "/propensity?step=1" }}
        />
      )}

      {regionsQuery.isSuccess && regions.length > 0 && (
        <CourseDestinationList destinations={regions} />
      )}
    </FlowShell>
  );
}
