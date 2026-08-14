"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <div className="flex w-full flex-col gap-1.5">
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        disabled={downloadMutation.isPending}
        onClick={() => downloadMutation.mutate()}
      >
        <Download className="size-4" strokeWidth={1.75} />
        {downloadMutation.isPending ? "다운로드 준비 중..." : "원본 다운로드"}
      </Button>
      {downloadMutation.isError && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          다운로드 링크를 가져오지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
