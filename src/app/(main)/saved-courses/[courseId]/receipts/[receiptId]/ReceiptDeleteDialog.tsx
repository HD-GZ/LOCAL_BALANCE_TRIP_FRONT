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
        <button
          type="button"
          className="flex h-12.5 flex-1 cursor-pointer items-center justify-center gap-2.25 rounded-[12px] border border-[#E8CDC0] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#B5654A]"
        >
          <Trash2 className="size-4.25" />
          삭제
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>증빙을 삭제할까요?</DialogTitle>
        <DialogDescription>삭제하면 이 여행의 환급 신청 목록에서 제외돼요.</DialogDescription>
        {deleteMutation.isError && (
          <p className="mt-2 text-[12px] text-red-500">
            삭제 중 오류가 발생했어요. 다시 시도해 주세요.
          </p>
        )}
        <div className="mt-5.5 flex w-full gap-2.5">
          <DialogClose asChild>
            <Button className="h-12.5 flex-1 border border-[#C3BDB3] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#222019] hover:bg-gray-100">
              취소
            </Button>
          </DialogClose>
          <Button
            className="h-12.5 flex-1 bg-[#B97056] text-[15px] font-semibold tracking-[-0.15px] text-white hover:bg-[#B97056]/90"
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
