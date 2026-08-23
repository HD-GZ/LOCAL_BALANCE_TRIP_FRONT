import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { requestTokenRefresh } from "@/lib/auth/refresh";

const PROXY_REFRESH_TIMEOUT = 5_000;
const PROTECTED_PATHS = [/^\/propensity$/, /^\/my(\/|$)/];
const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

const handleI18nRouting = createMiddleware(routing);

function isProtectedPath(pathname: string) {
  const withoutLocale = pathname.replace(LOCALE_PREFIX, "") || "/";

  return PROTECTED_PATHS.some((pattern) => pattern.test(withoutLocale));
}

export async function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return handleI18nRouting(request);
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken) {
    return handleI18nRouting(request);
  }

  const refreshTokenValue = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (refreshTokenValue) {
    const tokens = await requestTokenRefresh(refreshTokenValue, PROXY_REFRESH_TIMEOUT);

    if (tokens) {
      request.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken);

      const response = handleI18nRouting(request);

      setAuthCookies(response.cookies, tokens);

      return response;
    }
  }

  /**
   * 왜 로그인 화면에 왔는지 알려줘야 한다. 미들웨어에서는 토스트를 띄울 수 없으므로
   * 이유를 쿼리 파라미터로 넘기고 로그인 화면이 그것을 읽어 안내한다.
   * 라우트는 그대로 두고 파라미터만 붙인다.
   */
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("reason", "auth");

  const redirectResponse = NextResponse.redirect(loginUrl);

  clearAuthCookies(redirectResponse.cookies);

  return redirectResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|shared-courses|.*\\..*).*)"],
};
