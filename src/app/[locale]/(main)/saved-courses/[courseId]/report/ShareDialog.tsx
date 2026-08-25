"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("report");

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
      toast.error(t("share.tokenError"));
      return;
    }

    try {
      const imageUrl = report.imageUrl || (await uploadImage(await fetchFallbackImageFile()));

      shareFeed({
        title: report.courseName,
        description: t("share.feedDescription", {
          courseName: report.courseName,
          count: report.visitedPlaceCount,
        }),
        imageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      });
    } catch (error) {
      console.error("카카오톡 공유 실패", error);
      toast.error(t("share.kakaoError"));
    }
  }

  return (
    <Dialog>
      {kakaoScript}
      <DialogTrigger asChild>
        <Button size="lg">{t("share.trigger")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("share.dialogTitle")}</DialogTitle>
        <DialogDescription>{t("share.dialogDescription")}</DialogDescription>
        <div className="flex w-full items-start gap-2.5 pt-3.75">
          <button
            type="button"
            disabled={!isKakaoReady || shareTokenMutation.isPending}
            onClick={handleShareKakao}
            className="press border-brand-line bg-surface hover:bg-brand-wash-soft flex flex-1 cursor-pointer flex-col items-center justify-center gap-2.25 rounded-sm border py-5 disabled:cursor-default disabled:opacity-45"
          >
            <Kakao className="size-6" />
            <span className="text-brand-ink text-body-sm font-semibold">{t("share.kakao")}</span>
          </button>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label={t("share.closeAria")}
            className="press text-ink-3 hover:text-ink absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full"
          >
            <X className="size-4.5" strokeWidth={1.75} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
