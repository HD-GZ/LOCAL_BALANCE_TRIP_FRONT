"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

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
import { useRouter } from "@/i18n/navigation";
import { isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";

type VerificationFeedback = {
  type: "error" | "success";
  message: string;
};

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const router = useRouter();

  const [now, setNow] = useState(() => Date.now());
  const [code, setCode] = useState<string[]>(createEmptyCode);
  const [feedback, setFeedback] = useState<VerificationFeedback | null>(null);

  const isCodeComplete = code.every(Boolean);
  const verificationCode = code.join("");
  const pendingEmailVerification = usePendingEmailVerification();
  const email = pendingEmailVerification?.email ?? t("emailFallback");
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
        message: isApiError(error) ? error.message : t("confirmError"),
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendEmailVerification,
    onSuccess: ({ email: resentEmail, verificationCodeExpiresIn }) => {
      savePendingEmailVerification({ email: resentEmail, verificationCodeExpiresIn });
      setCode(createEmptyCode());
      setFeedback({ type: "success", message: t("resendSuccess") });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: isApiError(error) ? error.message : t("resendError"),
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
        message: t("missingEmail"),
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
    <AuthShell title={t("title")} description={t("description", { email })}>
      <div className="pb-6">
        <SignupStepper currentStep="verify-email" />
      </div>
      <CodeInput value={code} onChange={handleCodeChange} />
      <p className="text-ink-2 text-body-sm mt-3 text-center tabular-nums" aria-live="polite">
        {isExpired
          ? t("expired")
          : t("remainingTime", { time: formatRemainingTime(remainingSeconds) })}
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
          {resendMutation.isPending ? t("resending") : t("resend")}
        </Button>
        <Button
          type="button"
          disabled={!isCodeComplete || isExpired || confirmMutation.isPending}
          onClick={handleConfirmCode}
          size="lg"
          className="flex-1"
        >
          {confirmMutation.isPending ? t("confirming") : t("confirm")}
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
