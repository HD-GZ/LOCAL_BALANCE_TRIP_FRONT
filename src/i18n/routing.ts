import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
});

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}
