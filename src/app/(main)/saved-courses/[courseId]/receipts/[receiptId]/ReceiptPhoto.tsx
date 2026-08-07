"use client";

import { X, ZoomIn } from "lucide-react";
import ReceiptDetailIcon from "@/assets/receiptDetail.svg";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ReceiptPhoto({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) {
    return (
      <div className="relative flex h-145.75 w-109.25 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#EBE7DF] bg-linear-to-br from-[#E7F0EA] via-[#DFEEE4] to-[#D3E6DA]">
        <ReceiptDetailIcon className="size-13" />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative h-145.75 w-109.25 shrink-0 cursor-pointer overflow-hidden rounded-[18px] border border-[#EBE7DF]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="영수증 원본" className="absolute inset-0 size-full object-cover" />
          <span className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#C4DDCD] bg-white/82 px-3 py-1.25">
            <ZoomIn className="size-3.25 text-[#1C4631]" />
            <span className="font-mono text-[11.5px] text-[#1C4631]">
              영수증 원본 · 클릭하여 확대
            </span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-[calc(100%-4rem)] border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">영수증 원본</DialogTitle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="영수증 원본"
          className="max-h-[85vh] w-auto rounded-[14px] object-contain"
        />
        <DialogClose asChild>
          <button
            type="button"
            aria-label="닫기"
            className="absolute top-3.5 right-3.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90"
          >
            <X className="size-4 text-[#222019]" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
