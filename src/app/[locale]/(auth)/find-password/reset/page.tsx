"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import AuthShell from "@/app/[locale]/(auth)/_components/AuthShell";
import PasswordResetStepper from "@/app/[locale]/(auth)/_components/PasswordResetStepper";
import {
  clearPasswordResetSession,
  getPasswordResetSession,
  hasUsableResetToken,
  usePasswordResetSession,
} from "@/features/auth/passwordResetStorage";
import { useRouter } from "@/i18n/navigation";

import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  const t = useTranslations("findPassword.reset");
  const router = useRouter();
  const session = usePasswordResetSession();

  // 하이드레이션 시점의 스냅샷은 항상 null이므로, 리셋 토큰 유무는 마운트 후 직접 확인한다.
  useEffect(() => {
    if (!hasUsableResetToken(getPasswordResetSession())) {
      clearPasswordResetSession();
      router.replace("/find-password");
    }
  }, [router]);

  if (!hasUsableResetToken(session)) {
    return null;
  }

  return (
    <AuthShell title={t("title")} description={t("description", { email: session.email })}>
      <div className="pb-6">
        <PasswordResetStepper currentStep="reset" />
      </div>
      <ResetPasswordForm resetToken={session.resetToken} />
    </AuthShell>
  );
}
