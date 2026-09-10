import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { resolveLocaleFromCookie } from "./resolveLocaleFromCookie";
import { routing } from "./routing";

const MESSAGE_DOMAINS = [
  "common",
  "home",
  "auth",
  "saved-courses",
  "course-recommend",
  "propensity",
  "shared-courses",
  "my",
  "policy",
  "receipts",
  "report",
  "apiError",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : await resolveLocaleFromCookie();

  const messagesByDomain = await Promise.all(
    MESSAGE_DOMAINS.map((domain) => import(`../../messages/${locale}/${domain}.json`)),
  );

  return {
    locale,
    messages: Object.assign({}, ...messagesByDomain.map((module) => module.default)),
  };
});
