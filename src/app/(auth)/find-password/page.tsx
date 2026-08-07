import Link from "next/link";

import PasswordResetStepper from "@/app/(auth)/_components/PasswordResetStepper";
import FindPasswordForm from "./FindPasswordForm";

export default function FindPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <PasswordResetStepper currentStep="email" />
        <p className="text-primary pb-3 text-[12px]">비밀번호 찾기</p>
        <div className="flex flex-col gap-1.5 pb-5">
          <p className="text-foreground text-2xl font-semibold">가입한 이메일을 알려주세요</p>
        </div>
        <FindPasswordForm />
        <p className="bg-muted text-label mt-4 rounded-[9px] px-3 py-2.5 text-[12px]">
          가입 이력이 없는 이메일이면 발송되지 않아요 <br /> 계정 존재 여부는 별도로 알리지
          않습니다.
        </p>
      </main>
      <div className="text-label text-[14px]">
        <Link href="/login" className="hover:underline">
          로그인으로 돌아가기
        </Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link href="/signup" className="hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
