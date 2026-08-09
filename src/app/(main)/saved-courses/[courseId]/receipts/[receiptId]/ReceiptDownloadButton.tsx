"use client";

import { Download } from "lucide-react";
import { useReceiptDownloadUrlMutation } from "@/features/receipts/queries";

export default function ReceiptDownloadButton({
  savedCourseId,
  receiptId,
}: {
  savedCourseId: number;
  receiptId: number;
}) {
  const downloadMutation = useReceiptDownloadUrlMutation(savedCourseId, receiptId);

  return (
    <div className="flex w-full flex-col items-start">
      <button
        type="button"
        disabled={downloadMutation.isPending}
        onClick={() => downloadMutation.mutate()}
        className="flex h-12.5 w-full cursor-pointer items-center justify-center gap-2.25 rounded-[12px] border border-[#C3BDB3] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#222019] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="size-4.25" />
        {downloadMutation.isPending ? "다운로드 준비 중..." : "원본 다운로드"}
      </button>
      {downloadMutation.isError && (
        <p className="mt-1.5 text-[12px] text-red-500">
          다운로드 링크를 가져오지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
