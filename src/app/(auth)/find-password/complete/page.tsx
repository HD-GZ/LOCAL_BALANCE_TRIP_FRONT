import Link from "next/link";

import CheckIcon from "@/assets/checkIcon.svg";

export default function ResetPasswordCompletePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col items-center rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <div className="border-primary mb-2.5 flex size-21 items-center justify-center rounded-full border bg-[#E7F0EA]">
          <CheckIcon />
        </div>
        <div className="flex flex-col gap-1.5 pb-5 text-center">
          <p className="text-foreground text-2xl font-semibold">비밀번호를 변경했어요</p>
          <p className="text-label text-[14px]">
            새 비밀번호로 다시 로그인해 주세요. <br />
            이전에 로그인한 기기는 모두 로그아웃됐어요.
          </p>
        </div>

        <Link
          href="/login"
          className="bg-primary hover:bg-primary/90 flex h-12.5 w-full items-center justify-center rounded-lg text-[15px] font-semibold text-white"
        >
          로그인하러 가기
        </Link>
      </main>
    </div>
  );
}
