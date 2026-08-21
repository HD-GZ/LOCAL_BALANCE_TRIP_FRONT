"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive-outline" size="lg" className="flex-1">
          <Trash2 className="size-4" strokeWidth={1.75} />
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>증빙을 삭제할까요?</DialogTitle>
        <DialogDescription>삭제하면 이 여행의 환급 신청 목록에서 제외돼요.</DialogDescription>
        {deleteMutation.isError && (
          <p role="alert" className="text-danger-ink text-cap mt-3 font-medium">
            삭제 중 오류가 발생했어요. 다시 시도해 주세요.
          </p>
        )}
        <div className="mt-6 flex w-full gap-3">
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="flex-1">
              취소
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            {deleteMutation.isPending ? "삭제하는 중..." : "삭제하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
