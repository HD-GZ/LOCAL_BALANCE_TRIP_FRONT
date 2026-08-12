import Link from "next/link";

import Logo from "@/assets/logo.svg";

/**
 * 인증 표면의 공통 골격. Operate 모드다 — 디자인이 눈에 띄면 실패이고,
 * 막힘 없이 통과하는 것이 성공이다 (PRODUCT.md).
 */
export default function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <Link href="/" className="text-ink flex items-center gap-2">
        <Logo className="size-5" />
        <span className="text-title-3 font-display">
          <span>로컬</span>
          <span className="text-brand-ink">밸런스</span>
          <span> 트립</span>
        </span>
      </Link>

      <div className="border-line bg-surface flex w-full max-w-[27rem] flex-col rounded-md border px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-2 pb-6">
          <h1 className="text-title-1 text-ink">{title}</h1>
          {description && <p className="text-ink-2 text-body-sm">{description}</p>}
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
