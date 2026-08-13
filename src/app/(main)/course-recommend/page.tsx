"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { recommendationQueries } from "@/features/recommendation/queries";
import { isApiError } from "@/lib/api/error";
import CourseDestinationList from "./CourseDestinationList";
import CourseRecommendStep from "./CourseRecommendStep";

export default function CourseRecommend() {
  const currentStep = 1;
  const regionsQuery = useQuery(recommendationQueries.regions());
  const regions = regionsQuery.data ?? [];
  const needsPropensity = isApiError(regionsQuery.error) && regionsQuery.error.status === 401;

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <div className="mt-9.5 flex w-170 flex-col items-center gap-6.5">
        <CourseRecommendStep currentStep={currentStep} />
        <div className="flex w-full flex-col items-start gap-2.25">
          <p className="text-[27px] font-semibold tracking-[-0.675px] text-[#222019]">
            성향에 맞는 추천 여행지
          </p>
          <p className="text-[15px] text-[#5F5B53]">
            성향에 꼭 맞는 여행지예요 · 지역을 누르면 맞춤 추천 코스를 볼 수 있어요
          </p>
        </div>
        {regionsQuery.isError &&
          (needsPropensity ? (
            <div className="flex w-full flex-col items-center gap-3 py-8">
              <p className="text-[13.5px] text-[#5F5B53]">
                취향 진단을 먼저 받아야 맞춤 코스를 추천받을 수 있어요.
              </p>
              <Button asChild className="h-11 px-6 text-[14px] font-semibold">
                <Link href="/propensity">취향 진단 하러 가기</Link>
              </Button>
            </div>
          ) : (
            <p className="text-[13px] text-red-500">
              {isApiError(regionsQuery.error)
                ? regionsQuery.error.message
                : "추천 여행지를 불러오는 중 오류가 발생했습니다."}
            </p>
          ))}
        {regionsQuery.isSuccess && regions.length === 0 && (
          <p className="text-[13px] text-[#928D84]">
            아직 추천된 여행지가 없어요. 취향 진단 결과에서 코스 추천을 받아보세요.
          </p>
        )}
        {regions.length > 0 && <CourseDestinationList destinations={regions} />}
      </div>
    </div>
  );
}
