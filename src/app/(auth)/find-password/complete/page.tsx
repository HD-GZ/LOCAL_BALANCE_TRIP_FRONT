import Link from "next/link";

import AuthShell from "@/app/(auth)/_components/AuthShell";
import SuccessMark from "@/app/(auth)/_components/SuccessMark";

export default function ResetPasswordCompletePage() {
  return (
    <AuthShell
      title="비밀번호를 변경했어요"
      description="새 비밀번호로 다시 로그인해 주세요. 이전에 로그인한 기기는 모두 로그아웃됐어요."
    >
      <SuccessMark />
      <Link
        href="/login"
        className="press bg-brand hover:bg-brand-hover text-body text-brand-on mt-6 flex h-12 w-full items-center justify-center rounded-sm font-semibold"
      >
        로그인하러 가기
      </Link>
    </AuthShell>
  );
}
