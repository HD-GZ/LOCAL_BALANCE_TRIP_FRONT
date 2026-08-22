import { getTranslations } from "next-intl/server";

import AuthShell from "@/app/[locale]/(auth)/_components/AuthShell";
import SignupStepper from "@/app/[locale]/(auth)/_components/SignupStepper";
import SuccessMark from "@/app/[locale]/(auth)/_components/SuccessMark";
import { Link } from "@/i18n/navigation";

export default async function SignupCompletePage() {
  const t = await getTranslations("signupComplete");

  return (
    <AuthShell title={t("title")} description={t("description")}>
      <div className="pb-6">
        <SignupStepper currentStep="complete" />
      </div>
      <SuccessMark />
      <Link
        href="/"
        className="press bg-brand hover:bg-brand-hover text-body text-brand-on mt-6 flex h-12 w-full items-center justify-center rounded-sm font-semibold"
      >
        {t("cta")}
      </Link>
    </AuthShell>
  );
}
