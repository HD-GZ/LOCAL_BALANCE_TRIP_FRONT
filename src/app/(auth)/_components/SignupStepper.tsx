import Stepper from "@/components/common/Stepper";

/** 공통 Stepper 를 재사용한다 — 진단·추천 흐름과 같은 단계 언어를 쓴다. */
const SIGNUP_STEPS = ["signup", "verify-email", "complete"] as const;
const LABELS = ["정보 입력", "이메일 인증", "완료"];

type SignupStep = (typeof SIGNUP_STEPS)[number];

export default function SignupStepper({ currentStep }: { currentStep: SignupStep }) {
  return (
    <div className="flex justify-center">
      <Stepper steps={LABELS} currentStep={SIGNUP_STEPS.indexOf(currentStep) + 1} showStepLabel />
    </div>
  );
}
