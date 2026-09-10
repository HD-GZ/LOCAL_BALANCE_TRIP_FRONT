"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";
import { useUpdateReceiptMutation } from "@/features/receipts/queries";
import type { ReceiptDetailResponse } from "@/features/receipts/types";
import type { SavedCourseDetailResponse } from "@/features/recommendation/types";

import ReceiptDeleteDialog from "./ReceiptDeleteDialog";
import ReceiptDownloadButton from "./ReceiptDownloadButton";
import ReceiptFields from "./ReceiptFields";
import ReceiptPhoto from "./ReceiptPhoto";

const breadcrumbLinkClassName =
  "text-ink-2 hover:text-brand-ink transition-colors duration-(--dur-1)";

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
  const t = useTranslations("receipts");
  const [merchantName, setMerchantName] = useState(receipt.merchantName);
  const [amount, setAmount] = useState(receipt.amount);
  const [paidDate, setPaidDate] = useState(receipt.paidDate);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isDirty =
    merchantName !== receipt.merchantName ||
    amount !== receipt.amount ||
    paidDate !== receipt.paidDate;
  const isMerchantNameEmpty = merchantName.trim().length === 0;
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

  const updateError = updateMutation.isError ? t("detail.updateError") : null;

  return (
    <>
      <nav
        aria-label={t("detail.breadcrumb.nav")}
        className="text-body-sm flex flex-wrap items-center gap-1.5"
      >
        <Link
          href="/saved-courses"
          onNavigate={(event) => guardedNavigate(event, "/saved-courses")}
          className={breadcrumbLinkClassName}
        >
          {t("detail.breadcrumb.savedCourses")}
        </Link>
        <ChevronRight className="text-ink-3 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        <Link
          href={receiptsListHref}
          onNavigate={(event) => guardedNavigate(event, receiptsListHref)}
          className={breadcrumbLinkClassName}
        >
          {course.title}
        </Link>
        <ChevronRight className="text-ink-3 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="text-ink font-semibold" aria-current="page">
          {t("detail.breadcrumb.current")}
        </span>
      </nav>

      <h1 className="text-title-1 text-ink sm:text-display-2 mt-5">{t("detail.heading")}</h1>

      <div className="mt-8 grid w-full gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <ReceiptPhoto imageUrl={receipt.imageUrl} />
          <ReceiptDownloadButton savedCourseId={courseId} receiptId={receiptId} />
        </div>

        <div className="flex flex-col gap-3">
          <ReceiptFields
            merchantName={merchantName}
            onMerchantNameChange={setMerchantName}
            amount={amount}
            onAmountChange={setAmount}
            paidDate={paidDate}
            onPaidDateChange={setPaidDate}
          />

          <p className="text-ink-3 text-cap flex items-start gap-1.5 font-normal">
            <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span>{t("detail.ocrNote")}</span>
          </p>

          {isMerchantNameEmpty && (
            <p role="alert" className="text-danger-ink text-cap font-medium">
              {t("detail.merchantRequired")}
            </p>
          )}
          {updateError && (
            <p role="alert" className="text-danger-ink text-cap font-medium">
              {updateError}
            </p>
          )}

          <div className="mt-3 flex gap-3">
            <Button
              size="lg"
              className="flex-2"
              disabled={!isDirty || isMerchantNameEmpty || updateMutation.isPending}
              onClick={() => updateMutation.mutate({ merchantName, amount, paidDate })}
            >
              {updateMutation.isPending
                ? t("detail.save.pending")
                : isDirty
                  ? t("detail.save.dirty")
                  : t("detail.save.clean")}
            </Button>
            <ReceiptDeleteDialog savedCourseId={courseId} receiptId={receiptId} />
          </div>
        </div>
      </div>

      <Dialog open={pendingHref !== null} onOpenChange={(open) => !open && setPendingHref(null)}>
        <DialogContent>
          <DialogTitle>{t("detail.leaveDialog.title")}</DialogTitle>
          <DialogDescription>{t("detail.leaveDialog.description")}</DialogDescription>
          <div className="mt-6 flex w-full gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleLeaveWithoutSaving}
            >
              {t("detail.leaveDialog.discard")}
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={updateMutation.isPending || isMerchantNameEmpty}
              onClick={handleSaveAndLeave}
            >
              {updateMutation.isPending
                ? t("detail.leaveDialog.saveAndLeavePending")
                : t("detail.leaveDialog.saveAndLeave")}
            </Button>
          </div>
          {isMerchantNameEmpty && (
            <p role="alert" className="text-danger-ink text-cap mt-3 font-medium">
              {t("detail.leaveDialog.merchantRequired")}
            </p>
          )}
          {updateError && (
            <p role="alert" className="text-danger-ink text-cap mt-3 font-medium">
              {updateError}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
