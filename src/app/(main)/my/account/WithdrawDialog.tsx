"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { withdrawMe } from "@/features/user/api";
import { userQueryKeys } from "@/features/user/queries";
import { useBooleanState } from "@/hooks/useBooleanState";
import { isApiError } from "@/lib/api/error";

export default function WithdrawDialog() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { value: isOpen, setTrue: open, setFalse: close } = useBooleanState();

  const withdrawMutation = useMutation({
    mutationFn: withdrawMe,
    onSuccess: () => {
      close();
      queryClient.removeQueries({ queryKey: userQueryKeys.me() });
      router.replace("/login");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-12.5 flex-1 border-[#D8B5A6] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#B97056] hover:bg-[#FBF6F3] hover:text-[#B97056]"
        >
          회원탈퇴
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>정말 탈퇴할까요?</DialogTitle>
        <DialogDescription>
          저장한 코스와 취향 진단 결과를 포함한 계정 정보가 삭제돼요. 삭제된 정보는 되돌릴 수
          없습니다.
        </DialogDescription>
        {withdrawMutation.isError && (
          <p className="mt-2 text-[12px] text-red-500">
            {isApiError(withdrawMutation.error)
              ? withdrawMutation.error.message
              : "회원탈퇴 중 오류가 발생했어요. 다시 시도해 주세요."}
          </p>
        )}
        <div className="mt-5.5 flex w-full gap-2.5">
          <DialogClose asChild>
            <Button className="h-12.5 flex-1 border border-[#C3BDB3] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#222019] hover:bg-gray-100">
              돌아가기
            </Button>
          </DialogClose>
          <Button
            className="h-12.5 flex-1 bg-[#B97056] text-[15px] font-semibold tracking-[-0.15px] text-white hover:bg-[#B97056]/90"
            disabled={withdrawMutation.isPending}
            onClick={() => withdrawMutation.mutate()}
          >
            {withdrawMutation.isPending ? "탈퇴하는 중..." : "회원탈퇴"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
