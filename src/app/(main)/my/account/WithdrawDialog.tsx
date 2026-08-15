"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

// 구글 플레이 콘솔 앱 심사(계정 삭제) 제출용: ?withdraw=open 접속 시 모달이 바로 열림
export default function WithdrawDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const {
    value: isOpen,
    setTrue: open,
    setFalse: close,
  } = useBooleanState(searchParams.get("withdraw") === "open");

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
        <Button type="button" variant="destructive-outline" size="lg" className="flex-1">
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
          <p
            role="alert"
            className="text-danger-ink text-cap font-medium"
            style={{ marginTop: "0.75rem" }}
          >
            {isApiError(withdrawMutation.error)
              ? withdrawMutation.error.message
              : "회원탈퇴 중 오류가 발생했어요. 다시 시도해 주세요."}
          </p>
        )}
        <div className="mt-6 flex w-full gap-3">
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="flex-1">
              돌아가기
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
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
