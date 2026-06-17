"use client";

import { type ClipboardEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import SignupStepper from "@/app/(auth)/_components/SignupStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmEmailVerification, resendEmailVerification } from "@/features/auth/api";
import {
  clearPendingEmailVerification,
  savePendingEmailVerification,
  usePendingEmailVerification,
} from "@/features/auth/storage";
import { isApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;
const EMAIL_FALLBACK = "가입한 이메일";

type VerificationFeedback = {
  type: "error" | "success";
  message: string;
};

function getRemainingSeconds(expiresAt: number | undefined, now: number) {
  if (!expiresAt) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiresAt - now) / 1000));
}

function formatRemainingTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function VerifyEmailPage() {
  const router = useRouter();

  const [now, setNow] = useState(() => Date.now());
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [feedback, setFeedback] = useState<VerificationFeedback | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

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
      setCode(Array(CODE_LENGTH).fill(""));
      setFeedback({ type: "success", message: "인증 코드를 다시 보냈어요." });
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: isApiError(error) ? error.message : "인증 코드 재전송 중 오류가 발생했습니다.",
      });
    },
  });

  const handleCodeChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextValue;
    setCode(nextCode);
    setFeedback(null);

    if (nextValue && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH - index);

    if (!pastedDigits) {
      return;
    }

    event.preventDefault();

    const nextCode = [...code];
    pastedDigits.split("").forEach((digit, offset) => {
      nextCode[index + offset] = digit;
    });

    setCode(nextCode);
    setFeedback(null);

    const nextFocusIndex = Math.min(index + pastedDigits.length, CODE_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
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
        <div className="flex h-15 gap-2.5">
          {code.map((digit, index) => (
            <Input
              key={index}
              aria-label={`인증 코드 ${index + 1}번째 자리`}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => handleCodeChange(index, event.target.value)}
              onKeyDown={(event) => handleCodeKeyDown(index, event)}
              onPaste={(event) => handleCodePaste(index, event)}
              className="h-full w-12.5 rounded-[13px] text-center text-xl font-semibold"
            />
          ))}
        </div>
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
