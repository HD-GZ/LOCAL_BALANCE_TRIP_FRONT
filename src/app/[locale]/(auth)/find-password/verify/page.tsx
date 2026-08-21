"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import AuthShell from "@/app/[locale]/(auth)/_components/AuthShell";
import CodeInput, { createEmptyCode } from "@/app/[locale]/(auth)/_components/CodeInput";
import PasswordResetStepper from "@/app/[locale]/(auth)/_components/PasswordResetStepper";
import { Button } from "@/components/ui/button";
import { confirmPasswordResetCode, requestPasswordResetCode } from "@/features/auth/api";
import { formatRemainingTime, getRemainingSeconds } from "@/features/auth/expiry";
import { RESEND_CODE_COOLDOWN_SECONDS } from "@/features/auth/passwordReset";
import {
  getPasswordResetSession,
  savePasswordResetCodeRequest,
  savePasswordResetToken,
  usePasswordResetSession,
} from "@/features/auth/passwordResetStorage";
import { isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";

type VerificationFeedback = {
  type: "error" | "success";
  message: string;
};

export default function FindPasswordVerifyPage() {
  const router = useRouter();

  const [now, setNow] = useState(() => Date.now());
  const [code, setCode] = useState<string[]>(createEmptyCode);
  const [feedback, setFeedback] = useState<VerificationFeedback | null>(null);

  const session = usePasswordResetSession();
  const email = session?.email;
  const isCodeComplete = code.every(Boolean);
  const remainingSeconds = getRemainingSeconds(session?.codeExpiresAt, now);
  const isExpired = remainingSeconds === 0;
  // 쿨다운은 발송 시각에서 계산한다. 컴포넌트 상태로 두면 새로고침할 때마다 60초가 새로 시작된다.
  const resendCooldownSeconds = getRemainingSeconds(
    session ? session.codeSentAt + RESEND_CODE_COOLDOWN_SECONDS * 1000 : undefined,
    now,
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  // 하이드레이션 시점의 스냅샷은 항상 null이므로, 세션 유무는 마운트 후 직접 확인한다.
  useEffect(() => {
    if (!getPasswordResetSession()) {
      router.replace("/find-password");
    }
  }, [router]);

  const confirmMutation = useMutation({
    mutationFn: confirmPasswordResetCode,
    onSuccess: ({ resetToken, resetTokenExpiresIn }) => {
      savePasswordResetToken({ resetToken, resetTokenExpiresIn });
      router.push("/find-password/reset");
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: isApiError(error) ? error.message : "인증번호 확인 중 오류가 발생했습니다.",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: requestPasswordResetCode,
    onSuccess: ({ verificationCodeExpiresIn }, { email: resentEmail }) => {
      savePasswordResetCodeRequest({ email: resentEmail, verificationCodeExpiresIn });
      setCode(createEmptyCode());
      setFeedback({ type: "success", message: "인증번호를 다시 보냈어요." });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: isApiError(error) ? error.message : "인증번호 재전송 중 오류가 발생했습니다.",
      });
    },
  });

  if (!email) {
    return null;
  }

  const handleCodeChange = (nextCode: string[]) => {
    setCode(nextCode);
    setFeedback(null);
  };

  const handleResendCode = () => {
    setFeedback(null);
    resendMutation.mutate({ email });
  };

  const handleConfirmCode = () => {
    if (!isCodeComplete) {
      return;
    }

    setFeedback(null);
    confirmMutation.mutate({ email, code: code.join("") });
  };

  const isResendDisabled = resendMutation.isPending || resendCooldownSeconds > 0;

  return (
    <AuthShell
      title="이메일을 확인해 주세요"
      description={`${email} 으로 6자리 인증번호를 보냈어요.`}
    >
      <div className="pb-6">
        <PasswordResetStepper currentStep="verify" />
      </div>
      <CodeInput value={code} onChange={handleCodeChange} disabled={isExpired} />
      <p className="text-ink-2 text-body-sm mt-3 text-center tabular-nums" aria-live="polite">
        {isExpired
          ? "인증번호가 만료되었습니다. 코드를 다시 받아주세요."
          : `남은 시간 ${formatRemainingTime(remainingSeconds)}`}
      </p>
      <div className="mt-4 flex w-full gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isResendDisabled}
          onClick={handleResendCode}
          size="lg"
          className="flex-1"
        >
          {resendMutation.isPending
            ? "전송 중..."
            : resendCooldownSeconds > 0
              ? `코드 재전송 (${resendCooldownSeconds}초)`
              : "코드 재전송"}
        </Button>
        <Button
          type="button"
          disabled={!isCodeComplete || isExpired || confirmMutation.isPending}
          onClick={handleConfirmCode}
          size="lg"
          className="flex-1"
        >
          {confirmMutation.isPending ? "확인 중..." : "인증 확인"}
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
      <button
        type="button"
        onClick={() => router.push("/find-password")}
        className="text-ink-2 text-body-sm hover:text-brand-ink mt-4 cursor-pointer text-center font-medium underline-offset-4 transition-colors duration-(--dur-1) hover:underline"
      >
        이메일 주소를 잘못 입력했나요?
      </button>
    </AuthShell>
  );
}
