import Stepper from "@/components/common/Stepper";

const STEPS = ["추천", "선택", "코스"];

export default function CourseRecommendStep({ currentStep }: { currentStep: number }) {
  return <Stepper steps={STEPS} currentStep={currentStep} showStepLabel />;
}
