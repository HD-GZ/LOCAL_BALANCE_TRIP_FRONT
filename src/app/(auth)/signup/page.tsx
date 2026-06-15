import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-140 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <div className="mb-6 flex items-center gap-[3.5px] self-center">
          <div className="bg-primary size-2.5 rounded-full" />
          <div className="h-0.5 w-2 bg-[#EBE7DF]" />
          <div className="size-2.25 rounded-full bg-[#C3BDB3]" />
          <div className="h-0.5 w-2 bg-[#EBE7DF]" />
          <div className="size-2.25 rounded-full bg-[#C3BDB3]" />
        </div>
        <div className="flex flex-col gap-1.5 pb-5">
          <p className="text-foreground text-2xl font-semibold">계정을 만들어 시작해요</p>
          <p className="text-label text-[14px]">
            취향 진단 · 저장 코스 · 혜택 매칭을 위해 기본 정보를 입력해 주세요.
          </p>
        </div>
        <SignupForm />
      </main>
      <div className="text-label text-[14px]">
        이미 계정이 있으신가요? &nbsp;
        <Link href="/login" className="text-primary hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
