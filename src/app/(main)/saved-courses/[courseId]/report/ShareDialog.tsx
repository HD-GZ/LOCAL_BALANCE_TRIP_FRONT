"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
import Kakao from "@/assets/kakao.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CourseReportResponse } from "@/features/reports/types";
import { createShareToken } from "@/features/share/api";
import { useKakaoShare } from "@/hooks/useKakaoShare";

async function fetchFallbackImageFile() {
  const response = await fetch("/default-thumbnail.png");
  const blob = await response.blob();

  return new File([blob], "default-thumbnail.png", { type: blob.type });
}

export default function ShareDialog({
  report,
  savedCourseId,
}: {
  report: CourseReportResponse;
  savedCourseId: number;
}) {
  const { isReady: isKakaoReady, kakaoScript, uploadImage, shareFeed } = useKakaoShare();
  const shareTokenMutation = useMutation({ mutationFn: createShareToken });

  async function handleShareKakao() {
    if (!isKakaoReady) {
      return;
    }

    let shareUrl: string;

    try {
      const { token } = await shareTokenMutation.mutateAsync(savedCourseId);
      shareUrl = `${window.location.origin}/shared-courses/${token}`;
    } catch (error) {
      console.error("공유 토큰 발급 실패", error);
      toast.error("공유 링크를 만들지 못했어요. 다시 시도해 주세요.");
      return;
    }

    try {
      const imageUrl = report.imageUrl || (await uploadImage(await fetchFallbackImageFile()));

      shareFeed({
        title: report.courseName,
        description: `${report.courseName} ${report.visitedPlaceCount}곳을 방문하고 완주한 여행 리포트예요.`,
        imageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      });
    } catch (error) {
      console.error("카카오톡 공유 실패", error);
      toast.error("카카오톡 공유에 실패했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <Dialog>
      {kakaoScript}
      <DialogTrigger asChild>
        <Button className="h-12.5 flex-1 cursor-pointer text-[15px] font-semibold tracking-[-0.15px]">
          공유하기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>어디에 공유할까요?</DialogTitle>
        <DialogDescription>지역 소비 금액은 공유되지 않아요.</DialogDescription>
        <div className="flex w-full items-start gap-2.5 pt-3.75">
          <button
            type="button"
            disabled={!isKakaoReady || shareTokenMutation.isPending}
            onClick={handleShareKakao}
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2.25 rounded-[14px] border border-[#C4DDCD] bg-white py-5 disabled:cursor-default disabled:opacity-50"
          >
            <Kakao className="size-6" />
            <span className="text-[13.5px] font-semibold tracking-[-0.135px] text-[#1C4631]">
              카카오톡
            </span>
          </button>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label="닫기"
            className="absolute top-4 right-4 flex size-7 cursor-pointer items-center justify-center rounded-full text-[#928D84] hover:text-[#222019]"
          >
            <X className="size-4.5" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
