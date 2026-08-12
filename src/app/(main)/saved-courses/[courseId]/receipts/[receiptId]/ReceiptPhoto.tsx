"use client";

import { X, ZoomIn } from "lucide-react";

import ReceiptDetailIcon from "@/assets/receiptDetail.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * 영수증 원본. 이전 구현은 사진 위에 "클릭하여 확대" pill 을 얹었다.
 * DESIGN.md §6 규칙 4에 따라 그 안내는 사진 아래로 내렸다.
 */
export default function ReceiptPhoto({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) {
    return (
      <div className="border-line bg-paper-sunk flex aspect-3/4 w-full items-center justify-center rounded-md border">
        <ReceiptDetailIcon className="text-ink-3 size-12" aria-hidden />
        <span className="sr-only">영수증 원본 이미지가 없어요</span>
      </div>
    );
  }

  return (
    <Dialog>
      <div className="flex w-full flex-col gap-2">
        <DialogTrigger asChild>
          <button
            type="button"
            className="lift border-line group relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-md border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="영수증 원본"
              className="lift-zoom absolute inset-0 size-full object-cover"
            />
          </button>
        </DialogTrigger>
        <p className="text-ink-3 text-cap flex items-center gap-1.5 font-normal">
          <ZoomIn className="size-3.5" strokeWidth={1.75} aria-hidden />
          이미지를 누르면 크게 볼 수 있어요
        </p>
      </div>

      <DialogContent className="w-auto max-w-[calc(100%-4rem)] bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">영수증 원본</DialogTitle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="영수증 원본"
          className="max-h-[85vh] w-auto rounded-md object-contain"
        />
        <DialogClose asChild>
          <button
            type="button"
            aria-label="닫기"
            className="press bg-surface text-ink border-line absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
