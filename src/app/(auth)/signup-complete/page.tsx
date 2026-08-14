import Link from "next/link";

import AuthShell from "@/app/(auth)/_components/AuthShell";
import SignupStepper from "@/app/(auth)/_components/SignupStepper";
import SuccessMark from "@/app/(auth)/_components/SuccessMark";

export default function SignupCompletePage() {
  return (
    <AuthShell
      title="여행자님, 환영해요"
      description="이메일 인증이 완료되어 회원가입이 끝났어요. 이제 취향에 맞는 로컬 슬로우 트립을 만나보세요."
    >
      <div className="pb-6">
        <SignupStepper currentStep="complete" />
      </div>
      <SuccessMark />
      <Link
        href="/"
        className="press bg-brand hover:bg-brand-hover text-body text-brand-on mt-6 flex h-12 w-full items-center justify-center rounded-sm font-semibold"
      >
        홈화면으로
      </Link>
    </AuthShell>
  );
}
