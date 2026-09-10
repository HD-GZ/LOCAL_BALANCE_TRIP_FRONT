"use client";

import { X, ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";

import ReceiptDetailIcon from "@/assets/receiptDetail.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * 영수증 원본. 기존 디자인(develop)처럼 안내 pill 을 사진 위에 얹는다 — 팀 합의 사항.
 */
export default function ReceiptPhoto({ imageUrl }: { imageUrl: string | null }) {
  const t = useTranslations("receipts");

  if (!imageUrl) {
    return (
      <div className="border-line bg-paper-sunk flex aspect-3/4 w-full items-center justify-center rounded-md border">
        <ReceiptDetailIcon className="text-ink-3 size-12" aria-hidden />
        <span className="sr-only">{t("photo.noImageAlt")}</span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-line group relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-md border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={t("photo.imageAlt")}
            className="absolute inset-0 size-full object-cover"
          />
          <span className="border-brand-line bg-surface/85 text-brand-ink text-cap absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-3 py-1 backdrop-blur-[2px]">
            <ZoomIn className="size-3.25" strokeWidth={1.75} aria-hidden />
            {t("photo.zoomHint")}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-auto max-w-[calc(100%-4rem)] bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{t("photo.dialogTitle")}</DialogTitle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={t("photo.imageAlt")}
          className="max-h-[85vh] w-auto rounded-md object-contain"
        />
        <DialogClose asChild>
          <button
            type="button"
            aria-label={t("photo.closeAria")}
            className="press bg-surface text-ink border-line absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
