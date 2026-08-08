"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";
import { useUpdateReceiptMutation } from "@/features/receipts/queries";
import type { ReceiptDetailResponse } from "@/features/receipts/types";
import type { SavedCourseDetailResponse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";
import ReceiptDeleteDialog from "./ReceiptDeleteDialog";
import ReceiptDownloadButton from "./ReceiptDownloadButton";
import ReceiptFields from "./ReceiptFields";
import ReceiptPhoto from "./ReceiptPhoto";

export default function ReceiptDetailContent({
  course,
  receipt,
  courseId,
  receiptId,
}: {
  course: SavedCourseDetailResponse;
  receipt: ReceiptDetailResponse;
  courseId: number;
  receiptId: number;
}) {
  const router = useRouter();
  const [merchantName, setMerchantName] = useState(receipt.merchantName);
  const [amount, setAmount] = useState(receipt.amount);
  const [paidDate, setPaidDate] = useState(receipt.paidDate);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isDirty =
    merchantName !== receipt.merchantName ||
    amount !== receipt.amount ||
    paidDate !== receipt.paidDate;
  const updateMutation = useUpdateReceiptMutation(courseId, receiptId);
  const receiptsListHref = `/saved-courses/${courseId}/receipts`;
  const { setGuard, requestNavigate } = useNavigationGuard();

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    setGuard(isDirty ? setPendingHref : null);
    return () => setGuard(null);
  }, [isDirty, setGuard]);

  const guardedNavigate = (event: { preventDefault: () => void }, href: string) => {
    if (requestNavigate(href)) event.preventDefault();
  };

  const handleSaveAndLeave = () => {
    updateMutation.mutate(
      { merchantName, amount, paidDate },
      {
        onSuccess: () => {
          if (pendingHref) router.push(pendingHref);
        },
      },
    );
  };

  const handleLeaveWithoutSaving = () => {
    const href = pendingHref;
    setPendingHref(null);
    if (href) router.push(href);
  };

  return (
    <>
      <div className="flex items-center gap-1.75 text-[13px] text-[#5F5B53]">
        <Link
          href="/saved-courses"
          onNavigate={(event) => guardedNavigate(event, "/saved-courses")}
          className="hover:text-[#2F6F4F]"
        >
          저장한 코스
        </Link>
        <span className="text-[#B8B3AA]">›</span>
        <Link
          href={receiptsListHref}
          onNavigate={(event) => guardedNavigate(event, receiptsListHref)}
          className="hover:text-[#2F6F4F]"
        >
          {course.title}
        </Link>
        <span className="text-[#B8B3AA]">›</span>
        <span className="text-[#222019]">증빙 상세</span>
      </div>
      <p className="pt-3.5 text-[24px] font-semibold tracking-[-0.6px] text-[#222019]">
        증빙 상세
      </p>
      <div className="flex w-full gap-6.5 pt-5.5">
        <div className="flex w-109.25 shrink-0 flex-col items-start gap-3">
          <ReceiptPhoto imageUrl={receipt.imageUrl} />
          <ReceiptDownloadButton savedCourseId={courseId} receiptId={receiptId} />
        </div>
        <div className="flex flex-1 flex-col items-start">
          <ReceiptFields
            merchantName={merchantName}
            onMerchantNameChange={setMerchantName}
            amount={amount}
            onAmountChange={setAmount}
            paidDate={paidDate}
            onPaidDateChange={setPaidDate}
          />
          <div className="flex w-full items-center gap-1.75 pt-3">
            <Info className="size-3.5 shrink-0 text-[#B8B3AA]" />
            <p className="flex-1 text-[12.5px] leading-relaxed text-[#B8B3AA]">
              OCR로 자동 추출된 값이에요 · 잘못 인식된 항목은 직접 수정할 수 있어요
            </p>
          </div>
          {updateMutation.isError && (
            <p className="pt-2 text-[12px] text-red-500">
              저장 중 오류가 발생했어요. 다시 시도해 주세요.
            </p>
          )}
          <div className="flex w-full gap-2.5 pt-6">
            <button
              type="button"
              disabled={!isDirty || updateMutation.isPending}
              onClick={() => updateMutation.mutate({ merchantName, amount, paidDate })}
              className={cn(
                "h-12.5 flex-1 rounded-[12px] text-[15px] font-semibold text-white disabled:cursor-not-allowed",
                isDirty ? "cursor-pointer bg-[#2F6F4F]" : "bg-[#A7C7B5]",
              )}
            >
              {updateMutation.isPending ? "저장하는 중..." : "저장하기"}
            </button>
            <ReceiptDeleteDialog savedCourseId={courseId} receiptId={receiptId} />
          </div>
        </div>
      </div>

      <Dialog open={pendingHref !== null} onOpenChange={(open) => !open && setPendingHref(null)}>
        <DialogContent>
          <DialogTitle>수정한 내용을 저장할까요?</DialogTitle>
          <DialogDescription>
            저장하지 않고 이동하면 수정한 가맹점명·금액·날짜가 사라져요.
          </DialogDescription>
          <div className="mt-5.5 flex w-full gap-2.5">
            <Button
              className="h-12.5 flex-1 border border-[#C3BDB3] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#222019] hover:bg-gray-100"
              onClick={handleLeaveWithoutSaving}
            >
              저장 안 함
            </Button>
            <Button
              className="h-12.5 flex-1 bg-[#2F6F4F] text-[15px] font-semibold tracking-[-0.15px] text-white hover:bg-[#2F6F4F]/90"
              disabled={updateMutation.isPending}
              onClick={handleSaveAndLeave}
            >
              {updateMutation.isPending ? "저장하는 중..." : "저장하고 이동"}
            </Button>
          </div>
          {updateMutation.isError && (
            <p className="mt-2 text-[12px] text-red-500">
              저장 중 오류가 발생했어요. 다시 시도해 주세요.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
