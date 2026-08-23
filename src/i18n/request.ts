import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
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
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messagesByDomain = await Promise.all(
    MESSAGE_DOMAINS.map((domain) => import(`../../messages/${locale}/${domain}.json`)),
  );

  return {
    locale,
    messages: Object.assign({}, ...messagesByDomain.map((module) => module.default)),
  };
});
