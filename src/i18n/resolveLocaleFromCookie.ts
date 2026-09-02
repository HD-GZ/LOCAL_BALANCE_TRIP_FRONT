import { cookies } from "next/headers";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

export async function resolveLocaleFromCookie() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  return hasLocale(routing.locales, localeCookie) ? localeCookie : routing.defaultLocale;
}
