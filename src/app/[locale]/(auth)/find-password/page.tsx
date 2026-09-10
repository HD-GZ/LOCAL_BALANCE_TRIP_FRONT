import { getTranslations } from "next-intl/server";

import AuthShell, { AuthLink } from "@/app/[locale]/(auth)/_components/AuthShell";
import PasswordResetStepper from "@/app/[locale]/(auth)/_components/PasswordResetStepper";

import FindPasswordForm from "./FindPasswordForm";

export default async function FindPasswordPage() {
  const t = await getTranslations("findPassword");

  return (
    <AuthShell
      title={t("title")}
      stepper={<PasswordResetStepper currentStep="email" />}
      footer={
        <>
          <AuthLink href="/login">{t("backToLogin")}</AuthLink>
          <span aria-hidden className="bg-line h-3 w-px" />
          <AuthLink href="/signup">{t("signupLink")}</AuthLink>
        </>
      }
    >
      <FindPasswordForm />
    </AuthShell>
  );
}
