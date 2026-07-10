"use client";

import Link from "next/link";

import SignupStepper from "@/app/(auth)/_components/SignupStepper";
import CheckIcon from "@/assets/check-icon.svg";

export default function SignupCompletePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col items-center rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <SignupStepper currentStep="complete" />
        <div className="border-primary mb-2.5 flex size-21 items-center justify-center rounded-full border bg-[#E7F0EA]">
          <CheckIcon />
        </div>
        <div className="flex flex-col gap-1.5 pb-5 text-center">
          <p className="text-foreground text-2xl font-semibold">여행자님, 환영해요!</p>
          <p className="text-label text-[14px]">
            이메일 인증이 완료되어 회원가입이 끝났어요. <br />
            이제 취향에 맞는 로컬 슬로우 트립을 만나보세요.
          </p>
        </div>

        <Link
          href="/"
          className="bg-primary hover:bg-primary/90 flex h-12.5 w-full items-center justify-center rounded-lg text-[15px] font-semibold text-white"
        >
          홈화면으로
        </Link>
      </main>
    </div>
  );
}
