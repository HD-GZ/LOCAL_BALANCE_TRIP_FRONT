"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import AuthShell from "@/app/[locale]/(auth)/_components/AuthShell";
import CodeInput, { createEmptyCode } from "@/app/[locale]/(auth)/_components/CodeInput";
import SignupStepper from "@/app/[locale]/(auth)/_components/SignupStepper";
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
    <AuthShell
      title="이메일을 확인해 주세요"
      description={`${email} 으로 6자리 인증 코드를 보냈어요.`}
    >
      <div className="pb-6">
        <SignupStepper currentStep="verify-email" />
      </div>
      <CodeInput value={code} onChange={handleCodeChange} />
      <p className="text-ink-2 text-body-sm mt-3 text-center tabular-nums" aria-live="polite">
        {isExpired
          ? "인증 코드가 만료되었습니다."
          : `남은 시간 ${formatRemainingTime(remainingSeconds)}`}
      </p>
      <div className="mt-4 flex w-full gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={resendMutation.isPending}
          onClick={handleResendCode}
          size="lg"
          className="flex-1"
        >
          {resendMutation.isPending ? "전송 중..." : "코드 재전송"}
        </Button>
        <Button
          type="button"
          disabled={!isCodeComplete || isExpired || confirmMutation.isPending}
          onClick={handleConfirmCode}
          size="lg"
          className="flex-1"
        >
          {confirmMutation.isPending ? "확인 중..." : "인증 완료"}
        </Button>
      </div>
      <p
        aria-live="polite"
        className={cn(
          "text-cap mt-3 text-center font-medium",
          !feedback && "sr-only",
          feedback?.type === "error" ? "text-danger-ink" : "text-brand-ink",
        )}
      >
        {feedback?.message ?? ""}
      </p>
    </AuthShell>
  );
}
