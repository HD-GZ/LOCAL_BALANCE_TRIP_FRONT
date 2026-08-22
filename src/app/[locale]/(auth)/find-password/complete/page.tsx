import { getTranslations } from "next-intl/server";

import AuthShell from "@/app/[locale]/(auth)/_components/AuthShell";
import SuccessMark from "@/app/[locale]/(auth)/_components/SuccessMark";
import { Link } from "@/i18n/navigation";

export default async function ResetPasswordCompletePage() {
  const t = await getTranslations("findPassword.complete");

  return (
    <AuthShell title={t("title")} description={t("description")}>
      <SuccessMark />
      <Link
        href="/login"
        className="press bg-brand hover:bg-brand-hover text-body text-brand-on mt-6 flex h-12 w-full items-center justify-center rounded-sm font-semibold"
      >
        {t("cta")}
      </Link>
    </AuthShell>
  );
}
