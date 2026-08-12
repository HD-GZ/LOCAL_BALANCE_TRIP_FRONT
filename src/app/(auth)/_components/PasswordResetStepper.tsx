import Stepper from "@/components/common/Stepper";

const PASSWORD_RESET_STEPS = ["email", "verify", "reset"] as const;
const LABELS = ["이메일 확인", "인증번호", "재설정"];

export type PasswordResetStep = (typeof PASSWORD_RESET_STEPS)[number];

export default function PasswordResetStepper({ currentStep }: { currentStep: PasswordResetStep }) {
  return (
    <div className="flex justify-center">
      <Stepper
        steps={LABELS}
        currentStep={PASSWORD_RESET_STEPS.indexOf(currentStep) + 1}
        showStepLabel
      />
    </div>
  );
}
