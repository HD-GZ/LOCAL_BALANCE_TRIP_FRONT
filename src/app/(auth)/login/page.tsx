import AuthShell, { AuthLink } from "@/app/(auth)/_components/AuthShell";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="다시 오신 걸 환영해요"
      description="내 취향과 예산에 맞춘 로컬 슬로우 트립을 이어서 설계해요."
      footer={
        <>
          <AuthLink href="/find-password">비밀번호 찾기</AuthLink>
          <span aria-hidden className="bg-line h-3 w-px" />
          <AuthLink href="/signup">회원가입</AuthLink>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
