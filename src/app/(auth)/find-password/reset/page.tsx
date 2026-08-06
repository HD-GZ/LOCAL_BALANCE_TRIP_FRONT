"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import PasswordResetStepper from "@/app/(auth)/_components/PasswordResetStepper";
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
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <PasswordResetStepper currentStep="reset" />
        <p className="text-primary pb-3 text-[12px]">비밀번호 재설정</p>
        <div className="flex flex-col gap-1.5 pb-5">
          <p className="text-foreground text-2xl font-semibold">새 비밀번호를 입력해 주세요</p>
          <p className="text-label text-[14px]">
            {session.email} 계정의 비밀번호를 새로 설정합니다.
          </p>
        </div>
        <ResetPasswordForm resetToken={session.resetToken} />
      </main>
    </div>
  );
}
