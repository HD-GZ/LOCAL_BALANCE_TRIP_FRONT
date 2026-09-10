"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("receipts");

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
        {downloadMutation.isPending ? t("download.pending") : t("download.action")}
      </Button>
      {downloadMutation.isError && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {t("download.error")}
        </p>
      )}
    </div>
  );
}
