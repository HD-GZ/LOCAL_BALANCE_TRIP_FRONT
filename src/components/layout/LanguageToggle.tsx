"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { locale: "ko", label: "한국어" },
  { locale: "en", label: "English" },
] as const;

const pillClassName =
  "text-body-sm flex h-9.5 items-center justify-center rounded-full px-3.5 font-semibold transition-colors duration-(--dur-1)";

export default function LanguageToggle() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname.startsWith("/shared-courses")) {
    return null;
  }

  return (
    <nav
      aria-label={t("languageToggle.ariaLabel")}
      className="bg-paper-sunk flex items-center gap-0.5 rounded-full p-1"
    >
      {LANGUAGES.map((lang) => {
        const active = locale === lang.locale;

        return (
          <Link
            key={lang.locale}
            href={{ pathname, query: Object.fromEntries(searchParams) }}
            locale={lang.locale}
            replace
            aria-current={active ? "true" : undefined}
            className={cn(
              pillClassName,
              active
                ? "bg-surface text-brand-ink shadow-[0_1px_2px_0_rgb(40_36_28/0.08)]"
                : "text-ink-2 hover:text-ink",
            )}
          >
            {lang.label}
          </Link>
        );
      })}
    </nav>
  );
}
