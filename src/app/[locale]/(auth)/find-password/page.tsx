import { getTranslations } from "next-intl/server";

import AuthShell, { AuthLink } from "@/app/[locale]/(auth)/_components/AuthShell";
import PasswordResetStepper from "@/app/[locale]/(auth)/_components/PasswordResetStepper";

import FindPasswordForm from "./FindPasswordForm";

export default async function FindPasswordPage() {
  const t = await getTranslations("findPassword");

  return (
    <AuthShell
      title={t("title")}
      footer={
        <>
          <AuthLink href="/login">{t("backToLogin")}</AuthLink>
          <span aria-hidden className="bg-line h-3 w-px" />
          <AuthLink href="/signup">{t("signupLink")}</AuthLink>
        </>
      }
    >
      <div className="pb-6">
        <PasswordResetStepper currentStep="email" />
      </div>
      <FindPasswordForm />
      <p className="bg-surface-2 text-ink-2 text-cap mt-5 rounded-sm px-3 py-2.5 font-normal">
        {t("disclaimer")}
      </p>
    </AuthShell>
  );
}
