"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthShell from "@/app/[locale]/(auth)/_components/AuthShell";
import PasswordResetStepper from "@/app/[locale]/(auth)/_components/PasswordResetStepper";
import {
  clearPasswordResetSession,
  getPasswordResetSession,
  hasUsableResetToken,
  usePasswordResetSession,
} from "@/features/auth/passwordResetStorage";

import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
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
    <AuthShell
      title="새 비밀번호를 입력해 주세요"
      description={`${session.email} 계정의 비밀번호를 새로 설정합니다.`}
    >
      <div className="pb-6">
        <PasswordResetStepper currentStep="reset" />
      </div>
      <ResetPasswordForm resetToken={session.resetToken} />
    </AuthShell>
  );
}
