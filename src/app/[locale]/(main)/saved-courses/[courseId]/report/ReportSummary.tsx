"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import RouteMarker from "@/assets/routeMarker.svg";
import { Button } from "@/components/ui/button";
import type { CourseReportResponse } from "@/features/reports/types";

import ShareDialog from "./ShareDialog";

/**
 * 완주 리포트. 걸은 거리 하나를 표면의 주인공으로 두고, 나머지 세 지표는
 * 괘선 아래 같은 무게로 나란히 놓는다 (DESIGN.md §5 — 선의 역할).
 */

function formatTourEndDate(tourEndedAt: string) {
  return tourEndedAt.slice(0, 10).replaceAll("-", ".");
}

function ReportStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-start gap-0.5">
      <p className="text-num-lg text-ink tabular-nums">{value}</p>
      <p className="text-ink-3 text-cap font-normal">{label}</p>
    </div>
  );
}

function ReportCardBody({ report }: { report: CourseReportResponse }) {
  const t = useTranslations("report");
  const isDistanceInKm = report.walkedDistanceMeters >= 1000;
  const distanceValue = isDistanceInKm
    ? (report.walkedDistanceMeters / 1000).toFixed(1)
    : String(report.walkedDistanceMeters);

  return (
    <>
      <div className="border-brand-line flex h-37.5 w-full items-center justify-center rounded-md border bg-[image:var(--thumb-gradient)]">
        <RouteMarker className="size-10" />
      </div>

      <p className="text-ink-3 text-cap w-full pt-4.75 font-normal">
        {t("summary.dateCompleted", { date: formatTourEndDate(report.tourEndedAt) })}
      </p>

      <p className="text-display-1 text-brand-ink w-full tabular-nums">
        {distanceValue}
        <span className="text-title-1 text-brand-ink"> {isDistanceInKm ? "km" : "m"}</span>
      </p>
      <p className="text-ink-2 text-body-sm w-full pb-5.75">{t("summary.walkedDistance")}</p>

      <div className="border-line flex w-full items-start justify-center gap-5 border-t pt-5.5">
        <ReportStat
          value={t("summary.visitedPlaceValue", { count: report.visitedPlaceCount })}
          label={t("summary.visitedPlaces")}
        />
        <ReportStat
          value={t("summary.totalSpentValue", { amount: report.totalSpentAmount.toLocaleString() })}
          label={t("summary.localSpending")}
        />
        <ReportStat
          value={t("summary.carbonValue", { amount: report.carbonReductionKg.toFixed(1) })}
          label={t("summary.carbonReduction")}
        />
      </div>
    </>
  );
}

export default function ReportSummary({
  report,
  savedCourseId,
}: {
  report: CourseReportResponse;
  savedCourseId: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations("report");

  async function handleSaveImage() {
    if (!cardRef.current) {
      return;
    }

    setIsSaving(true);

    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = t("summary.downloadFileName", { courseName: report.courseName });
      link.click();
    } catch {
      toast.error(t("summary.saveImageError"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-1.75">
      <div className="flex w-full flex-col items-center gap-1.75">
        <ReportCardBody report={report} />
      </div>

      {/* 이미지 저장을 위한 캡쳐용 div */}
      <div aria-hidden className="pointer-events-none sr-only">
        <div ref={cardRef} className="bg-paper flex w-216 items-center justify-center p-10">
          <div className="border-line bg-surface shadow-overlay flex w-180 flex-col items-center gap-1.75 rounded-md border p-8">
            <ReportCardBody report={report} />
          </div>
        </div>
      </div>

      <div className="flex w-full items-start justify-center gap-2.5 pt-6.75">
        <Button variant="outline" size="lg" disabled={isSaving} onClick={handleSaveImage}>
          {isSaving ? t("summary.saveImagePending") : t("summary.saveImage")}
        </Button>
        <ShareDialog report={report} savedCourseId={savedCourseId} />
      </div>

      <p className="text-ink-3 text-cap w-full pt-2.25 text-center font-normal">
        {t("summary.carbonFormula")}
      </p>
    </div>
  );
}
