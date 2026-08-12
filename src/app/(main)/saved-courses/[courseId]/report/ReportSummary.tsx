"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import RouteMarker from "@/assets/routeMarker.svg";
import { Button } from "@/components/ui/button";
import type { CourseReportResponse } from "@/features/reports/types";
import ShareDialog from "./ShareDialog";

function formatTourEndDate(tourEndedAt: string) {
  return tourEndedAt.slice(0, 10).replaceAll("-", ".");
}

function ReportCardBody({ report }: { report: CourseReportResponse }) {
  const isDistanceInKm = report.walkedDistanceMeters >= 1000;
  const distanceValue = isDistanceInKm
    ? (report.walkedDistanceMeters / 1000).toFixed(1)
    : report.walkedDistanceMeters;

  return (
    <>
      <div className="flex h-37.5 w-full items-center justify-center rounded-[18px] border border-[#C4DDCD] bg-linear-to-br from-[#E7F0EA] via-[#DFEEE4] to-[#D3E6DA]">
        <RouteMarker className="size-10" />
      </div>
      <div className="flex w-full flex-col items-start pt-4.75">
        <p className="text-[12px] text-[#928D84]">
          {formatTourEndDate(report.tourEndedAt)} · 여행 완료
        </p>
      </div>
      <p className="w-full text-[60px] leading-15 font-bold tracking-[-2.4px] text-[#1C4631]">
        {distanceValue}
        <span className="text-[24px] font-semibold tracking-[-0.48px]">
          {" "}
          {isDistanceInKm ? "km" : "m"}
        </span>
      </p>
      <div className="flex w-full flex-col items-start pb-5.75">
        <p className="text-[14px] text-[#5F5B53]">걸은 거리</p>
      </div>
      <div className="flex w-full items-start justify-center gap-5 border-t border-[#EBE7DF] pt-5.5">
        <div className="flex w-full flex-1 flex-col items-start gap-0.5">
          <p className="text-[20px] font-bold tracking-[-0.4px] text-[#222019]">
            {report.visitedPlaceCount}곳
          </p>
          <p className="text-[12.5px] text-[#928D84]">방문 장소</p>
        </div>
        <div className="flex w-full flex-1 flex-col items-start gap-0.5">
          <p className="text-[20px] font-bold tracking-[-0.4px] text-[#222019]">
            {report.totalSpentAmount.toLocaleString()}원
          </p>
          <p className="text-[12.5px] text-[#928D84]">지역 소비</p>
        </div>
        <div className="flex w-full flex-1 flex-col items-start gap-0.5">
          <p className="text-[20px] font-bold tracking-[-0.4px] text-[#222019]">
            약 {report.carbonReductionKg.toFixed(1)}kg
          </p>
          <p className="text-[12.5px] text-[#928D84]">탄소 절감량</p>
        </div>
      </div>
    </>
  );
}

export default function ReportSummary({ report }: { report: CourseReportResponse }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveImage() {
    if (!cardRef.current) {
      return;
    }

    setIsSaving(true);

    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${report.courseName}_리포트.png`;
      link.click();
    } catch {
      toast.error("이미지를 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-1.75">
      <div className="flex w-full flex-col items-center gap-1.75">
        <ReportCardBody report={report} />
      </div>
      {/* 이미지 저장의 위한 캡쳐용 div */}
      <div aria-hidden className="pointer-events-none sr-only">
        <div
          ref={cardRef}
          className="flex w-216 items-center justify-center bg-[#F3F1EC] p-10"
        >
          <div className="flex w-180 flex-col items-center gap-1.75 rounded-[24px] border border-[#EBE7DF] bg-white p-8 shadow-[0px_16px_48px_-12px_rgba(40,36,28,0.18)]">
            <ReportCardBody report={report} />
          </div>
        </div>
      </div>
      <div className="flex w-full items-start justify-center gap-2.5 pt-6.75">
        <Button
          variant="outline"
          disabled={isSaving}
          onClick={handleSaveImage}
          className="h-12.5 flex-1 cursor-pointer border-[#C3BDB3] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#222019] hover:bg-gray-100"
        >
          {isSaving ? "저장 중..." : "이미지 저장"}
        </Button>
        <ShareDialog />
      </div>
      <div className="flex w-full flex-col items-center pt-2.25">
        <p className="text-[12.5px] text-[#B8B3AA]">
          탄소 절감량 = 걸은 거리(m) ÷ 1,000 × 승용차 배산계수 0.21(kg/km)
        </p>
      </div>
    </div>
  );
}
