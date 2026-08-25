"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

/**
 * 기존 디자인(develop)의 가운데 한 줄 형태로 되돌렸다 — 팀 합의 사항.
 * 고객센터는 해당 라우트가 아직 없으므로 링크가 아닌 텍스트로 둔다.
 */
const ITEMS: { key: "terms" | "privacy" | "customerService"; href?: string }[] = [
  { key: "terms", href: "/policy/terms" },
  { key: "privacy", href: "/policy/privacy" },
  { key: "customerService" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="text-ink-3 text-cap mt-auto w-full py-5 text-center font-normal">
      {t("copyright")}
      {ITEMS.map((item) => (
        <span key={item.key}>
          <span aria-hidden className="px-2">
            ·
          </span>
          {item.href ? (
            <Link href={item.href} className="hover:text-ink-2 transition-colors duration-(--dur-1)">
              {t(item.key)}
            </Link>
          ) : (
            t(item.key)
          )}
        </span>
      ))}
    </footer>
  );
}
