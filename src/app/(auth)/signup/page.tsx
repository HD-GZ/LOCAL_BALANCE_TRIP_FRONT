import AuthShell, { AuthLink } from "@/app/(auth)/_components/AuthShell";
import SignupStepper from "@/app/(auth)/_components/SignupStepper";

import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="계정을 만들어 시작해요"
      description="취향 진단과 저장 코스, 혜택 매칭을 위해 기본 정보를 입력해 주세요."
      footer={
        <>
          <span>이미 계정이 있으신가요?</span>
          <AuthLink href="/login">로그인</AuthLink>
        </>
      }
    >
      <div className="pb-6">
        <SignupStepper currentStep="signup" />
      </div>
      <SignupForm />
    </AuthShell>
  );
}
