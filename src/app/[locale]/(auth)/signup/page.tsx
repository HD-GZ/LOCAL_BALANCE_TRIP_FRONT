import { getTranslations } from "next-intl/server";

import AuthShell, { AuthLink } from "@/app/[locale]/(auth)/_components/AuthShell";
import SignupStepper from "@/app/[locale]/(auth)/_components/SignupStepper";

import SignupForm from "./SignupForm";

export default async function SignupPage() {
  const t = await getTranslations("signup");

  return (
    <AuthShell
      title={t("title")}
      description={t("description")}
      stepper={<SignupStepper currentStep="signup" />}
      footer={
        <>
          <span>{t("hasAccount")}</span>
          <AuthLink href="/login">{t("loginLink")}</AuthLink>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
