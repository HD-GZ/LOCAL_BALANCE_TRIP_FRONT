import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import AuthShell, { AuthLink } from "@/app/[locale]/(auth)/_components/AuthShell";

import AuthRedirectNotice from "./AuthRedirectNotice";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const t = await getTranslations("login");

  return (
    <AuthShell
      title={t("title")}
      description={t("description")}
      footer={
        <>
          <AuthLink href="/find-password">{t("findPasswordLink")}</AuthLink>
          <span aria-hidden className="bg-line h-3 w-px" />
          <AuthLink href="/signup">{t("signupLink")}</AuthLink>
        </>
      }
    >
      {/* useSearchParams 를 쓰므로 정적 프리렌더를 막지 않도록 경계를 둔다. */}
      <Suspense fallback={null}>
        <AuthRedirectNotice />
      </Suspense>
      <LoginForm />
    </AuthShell>
  );
}
