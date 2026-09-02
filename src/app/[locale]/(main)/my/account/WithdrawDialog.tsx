"use client";

import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { withdrawMe } from "@/features/user/api";
import { userQueryKeys } from "@/features/user/queries";
import { useBooleanState } from "@/hooks/useBooleanState";
import { useRouter } from "@/i18n/navigation";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";

// 구글 플레이 콘솔 앱 심사(계정 삭제) 제출용: ?withdraw=open 접속 시 모달이 바로 열림
export default function WithdrawDialog() {
  const t = useTranslations("withdraw");
  const tApiError = useTranslations("apiError");
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
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
        {withdrawMutation.isError && (
          <p
            role="alert"
            className="text-danger-ink text-cap font-medium"
            style={{ marginTop: "0.75rem" }}
          >
            {isApiError(withdrawMutation.error)
              ? getApiErrorMessage(withdrawMutation.error, tApiError)
              : t("errorGeneric")}
          </p>
        )}
        <div className="mt-6 flex w-full gap-3">
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="flex-1">
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            disabled={withdrawMutation.isPending}
            onClick={() => withdrawMutation.mutate()}
          >
            {withdrawMutation.isPending ? t("confirming") : t("confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
