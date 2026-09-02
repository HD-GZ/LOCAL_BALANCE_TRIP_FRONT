"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import FlowShell from "@/components/common/FlowShell";
import SurfaceState from "@/components/common/SurfaceState";
import { recommendationQueries } from "@/features/recommendation/queries";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";

import CourseDestinationList from "./CourseDestinationList";
import { useCourseSteps } from "./steps";

function DestinationListLoading({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-16">
      <Loader2 className="text-brand size-6 animate-spin" strokeWidth={1.75} aria-hidden />
      <p className="text-ink-2 text-body-sm">{label}</p>
    </div>
  );
}

export default function CourseRecommend() {
  const t = useTranslations("courseRecommend.page");
  const tCommon = useTranslations();
  const tApiError = useTranslations("apiError");
  const courseSteps = useCourseSteps();
  const regionsQuery = useQuery(recommendationQueries.regions());
  const regions = regionsQuery.data ?? [];
  /**
   * 진단을 아직 받지 않은 계정은 401로 돌아온다. 네트워크 오류가 아니라 순서 문제이므로
   * "다시 시도"가 아니라 진단으로 보낸다.
   */
  const needsPropensity = isApiError(regionsQuery.error) && regionsQuery.error.status === 401;

  return (
    <FlowShell
      steps={courseSteps}
      currentStep={1}
      showStepLabel
      align="start"
      title={t("title")}
      description={t("description")}
    >
      {regionsQuery.isPending && <DestinationListLoading label={t("loading")} />}

      {regionsQuery.isError &&
        (needsPropensity ? (
          <SurfaceState
            title={t("needsPropensity.title")}
            description={t("needsPropensity.description")}
            action={{ label: t("needsPropensity.cta"), href: "/propensity?step=1" }}
          />
        ) : (
          <SurfaceState
            tone="error"
            title={t("error.title")}
            description={
              isApiError(regionsQuery.error)
                ? getApiErrorMessage(regionsQuery.error, tApiError)
                : t("error.description")
            }
            action={{ label: tCommon("retry"), onRetry: () => regionsQuery.refetch() }}
          />
        ))}

      {regionsQuery.isSuccess && regions.length === 0 && (
        <SurfaceState
          title={t("empty.title")}
          description={t("empty.description")}
          action={{ label: t("empty.cta"), href: "/propensity?step=1" }}
        />
      )}

      {regionsQuery.isSuccess && regions.length > 0 && (
        <CourseDestinationList destinations={regions} />
      )}
    </FlowShell>
  );
}
