import AuthShell, { AuthLink } from "@/app/[locale]/(auth)/_components/AuthShell";
import PasswordResetStepper from "@/app/[locale]/(auth)/_components/PasswordResetStepper";

import FindPasswordForm from "./FindPasswordForm";

export default function FindPasswordPage() {
  return (
    <AuthShell
      title="가입한 이메일을 알려주세요"
      footer={
        <>
          <AuthLink href="/login">로그인으로 돌아가기</AuthLink>
          <span aria-hidden className="bg-line h-3 w-px" />
          <AuthLink href="/signup">회원가입</AuthLink>
        </>
      }
    >
      <div className="pb-6">
        <PasswordResetStepper currentStep="email" />
      </div>
      <FindPasswordForm />
      <p className="bg-surface-2 text-ink-2 text-cap mt-5 rounded-sm px-3 py-2.5 font-normal">
        가입 이력이 없는 이메일이면 발송되지 않아요. 계정 존재 여부는 별도로 알리지 않습니다.
      </p>
    </AuthShell>
  );
}
