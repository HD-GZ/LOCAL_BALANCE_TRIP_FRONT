"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteReceiptMutation } from "@/features/receipts/queries";

export default function ReceiptDeleteDialog({
  savedCourseId,
  receiptId,
}: {
  savedCourseId: number;
  receiptId: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteMutation = useDeleteReceiptMutation(savedCourseId, receiptId);
  const t = useTranslations("receipts");

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive-outline" size="lg" className="flex-1">
          <Trash2 className="size-4" strokeWidth={1.75} />
          {t("deleteDialog.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
        <DialogDescription>{t("deleteDialog.description")}</DialogDescription>
        {deleteMutation.isError && (
          <p role="alert" className="text-danger-ink text-cap mt-3 font-medium">
            {t("deleteDialog.error")}
          </p>
        )}
        <div className="mt-6 flex w-full gap-3">
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="flex-1">
              {t("deleteDialog.cancel")}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            {deleteMutation.isPending ? t("deleteDialog.confirmPending") : t("deleteDialog.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
