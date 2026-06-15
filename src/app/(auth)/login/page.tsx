import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 py-35">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <p className="pb-3 text-[12px] text-primary">로그인</p>
        <div className="flex flex-col gap-1.5 pb-5">
          <p className="text-2xl font-semibold text-foreground">다시 오신 걸 환영해요</p>
          <p className="text-[14px] text-label">
            내 취향과 예산에 맞춘 로컬 슬로우 트립을 이어서 설계해요.
          </p>
        </div>
        <LoginForm />
      </main>
      <div className="text-[14px] text-label">
        <Link href="/find-password">비밀번호 찾기</Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link href="/signup">회원가입</Link>
      </div>
    </div>
  );
}
