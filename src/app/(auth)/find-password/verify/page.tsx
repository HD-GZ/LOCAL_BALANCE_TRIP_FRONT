"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import CodeInput, { createEmptyCode } from "@/app/(auth)/_components/CodeInput";
import PasswordResetStepper from "@/app/(auth)/_components/PasswordResetStepper";
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
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <PasswordResetStepper currentStep="verify" />
        <div className="flex flex-col gap-1.5 pb-5 text-center">
          <p className="text-foreground text-2xl font-semibold">이메일을 확인해 주세요</p>
          <p className="text-label text-[14px]">
            {email} 으로 <br /> 6자리 인증번호를 보냈어요.
          </p>
        </div>
        <CodeInput value={code} onChange={handleCodeChange} disabled={isExpired} />
        <p className="mt-3 text-center text-[13px] text-[#928D84]" aria-live="polite">
          {isExpired
            ? "인증번호가 만료되었습니다. 코드를 다시 받아주세요."
            : `남은 시간 ${formatRemainingTime(remainingSeconds)}`}
        </p>
        <div className="mt-1 flex w-full gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isResendDisabled}
            onClick={handleResendCode}
            className="text-foreground h-12.5 flex-1 rounded-xl border-[#C3BDB3] bg-white text-[15px] hover:bg-white"
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
            className={cn(
              "h-12.5 flex-1 rounded-xl text-[15px]",
              (!isCodeComplete || isExpired) &&
                "text-placeholder border border-[#EBE7DF] bg-[#E9E5DC] disabled:opacity-100",
            )}
          >
            {confirmMutation.isPending ? "확인 중..." : "인증 확인"}
          </Button>
        </div>
        <p
          aria-live="polite"
          className={cn(
            "mt-3 text-center text-[12px]",
            !feedback && "sr-only",
            feedback?.type === "error" ? "text-red-500" : "text-primary",
          )}
        >
          {feedback?.message ?? ""}
        </p>
        <button
          type="button"
          onClick={() => router.push("/find-password")}
          className="text-label mt-4 text-center text-[13px] hover:underline"
        >
          이메일 주소를 잘못 입력했나요?
        </button>
      </main>
    </div>
  );
}
