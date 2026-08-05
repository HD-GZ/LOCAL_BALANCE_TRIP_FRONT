"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import CodeInput, { createEmptyCode } from "@/app/(auth)/_components/CodeInput";
import SignupStepper from "@/app/(auth)/_components/SignupStepper";
import { Button } from "@/components/ui/button";
import { confirmEmailVerification, resendEmailVerification } from "@/features/auth/api";
import { formatRemainingTime, getRemainingSeconds } from "@/features/auth/expiry";
import {
  clearPendingEmailVerification,
  savePendingEmailVerification,
  usePendingEmailVerification,
} from "@/features/auth/storage";
import { isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";

const EMAIL_FALLBACK = "가입한 이메일";

type VerificationFeedback = {
  type: "error" | "success";
  message: string;
};

export default function VerifyEmailPage() {
  const router = useRouter();

  const [now, setNow] = useState(() => Date.now());
  const [code, setCode] = useState<string[]>(createEmptyCode);
  const [feedback, setFeedback] = useState<VerificationFeedback | null>(null);

  const isCodeComplete = code.every(Boolean);
  const verificationCode = code.join("");
  const pendingEmailVerification = usePendingEmailVerification();
  const email = pendingEmailVerification?.email ?? EMAIL_FALLBACK;
  const remainingSeconds = getRemainingSeconds(pendingEmailVerification?.expiresAt, now);
  const isExpired = remainingSeconds === 0;

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const confirmMutation = useMutation({
    mutationFn: confirmEmailVerification,
    onSuccess: () => {
      clearPendingEmailVerification();
      router.push("/signup-complete");
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: isApiError(error) ? error.message : "이메일 인증 중 오류가 발생했습니다.",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendEmailVerification,
    onSuccess: ({ email: resentEmail, verificationCodeExpiresIn }) => {
      savePendingEmailVerification({ email: resentEmail, verificationCodeExpiresIn });
      setCode(createEmptyCode());
      setFeedback({ type: "success", message: "인증 코드를 다시 보냈어요." });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: isApiError(error) ? error.message : "인증 코드 재전송 중 오류가 발생했습니다.",
      });
    },
  });

  const handleCodeChange = (nextCode: string[]) => {
    setCode(nextCode);
    setFeedback(null);
  };

  const handleResendCode = () => {
    if (!pendingEmailVerification?.email) {
      setFeedback({
        type: "error",
        message: "인증 코드를 받을 이메일 정보를 찾을 수 없습니다.",
      });
      return;
    }

    setFeedback(null);
    resendMutation.mutate({ email: pendingEmailVerification.email });
  };

  const handleConfirmCode = () => {
    if (!isCodeComplete) {
      return;
    }

    setFeedback(null);
    confirmMutation.mutate({ code: verificationCode });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <SignupStepper currentStep="verify-email" />
        <div className="flex flex-col gap-1.5 pb-5 text-center">
          <p className="text-foreground text-2xl font-semibold">이메일을 확인해 주세요</p>
          <p className="text-label text-[14px]">
            {email} 으로 <br /> 6자리 인증 코드를 보냈어요.
          </p>
        </div>
        <CodeInput value={code} onChange={handleCodeChange} />
        <p className="mt-3 text-center text-[13px] text-[#928D84]" aria-live="polite">
          {isExpired
            ? "인증 코드가 만료되었습니다."
            : `남은 시간 ${formatRemainingTime(remainingSeconds)}`}
        </p>
        <div className="mt-1 flex w-full gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={resendMutation.isPending}
            onClick={handleResendCode}
            className="text-foreground h-12.5 flex-1 rounded-xl border-[#C3BDB3] bg-white text-[15px] hover:bg-white"
          >
            {resendMutation.isPending ? "전송 중..." : "코드 재전송"}
          </Button>
          <Button
            type="button"
            disabled={!isCodeComplete || isExpired || confirmMutation.isPending}
            onClick={handleConfirmCode}
            className={cn(
              "h-12.5 flex-1 rounded-xl text-[15px]",
              (!isCodeComplete || isExpired) &&
                "text-placeholder border border-[#EBE7DF] bg-[#E9E5DC] disabled:opacity-100",
            )}
          >
            {confirmMutation.isPending ? "확인 중..." : "인증 완료"}
          </Button>
        </div>
        {feedback && (
          <p
            aria-live="polite"
            className={cn(
              "mt-3 text-center text-[12px]",
              feedback.type === "error" ? "text-red-500" : "text-primary",
            )}
          >
            {feedback.message}
          </p>
        )}
      </main>
    </div>
  );
}
