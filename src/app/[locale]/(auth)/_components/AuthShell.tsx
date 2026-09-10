"use client";

import { useTranslations } from "next-intl";

import Logo from "@/assets/logo.svg";
import { Link } from "@/i18n/navigation";

/**
 * 인증 표면의 공통 골격. Operate 모드다 — 디자인이 눈에 띄면 실패이고,
 * 막힘 없이 통과하는 것이 성공이다 (PRODUCT.md).
 *
 * 일부 호출부(이메일 인증, 비밀번호 재설정)가 Client Component라서
 * 이 컴포넌트도 Client Component로 둔다 — Server Component는 Client
 * Component 안에서 직접 import해 렌더링할 수 없다.
 */
export default function AuthShell({
  title,
  description,
  stepper,
  children,
  footer,
}: {
  title: string;
  description?: string;
  stepper?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const t = useTranslations();

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <Link href="/" className="text-ink flex items-center gap-2">
        <Logo className="size-5" />
        <span className="text-title-3 font-display">
          <span>{t("brand.prefix")}</span>
          <span className="text-brand-ink">{t("brand.emphasis")}</span>
          <span>{t("brand.suffix")}</span>
        </span>
      </Link>

      <div className="border-line bg-surface shadow-card flex w-full max-w-[27rem] flex-col rounded-md border px-6 py-8 sm:px-8">
        {stepper && <div className="pb-6">{stepper}</div>}
        <div className="flex flex-col items-center gap-2 pb-6 text-center">
          <h1 className="text-title-1 text-ink">{title}</h1>
          {description && (
            <p className="text-ink-2 text-body-sm whitespace-pre-line">{description}</p>
          )}
        </div>
        {children}
      </div>

      {footer && <div className="text-ink-2 text-body-sm flex items-center gap-4">{footer}</div>}
    </main>
  );
}

/** 인증 표면 하단의 보조 링크. */
export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-brand-ink font-medium underline-offset-4 transition-colors duration-(--dur-1) hover:underline"
    >
      {children}
    </Link>
  );
}
