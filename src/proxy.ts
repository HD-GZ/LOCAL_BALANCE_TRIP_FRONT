import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { requestTokenRefresh } from "@/lib/auth/refresh";

const PROXY_REFRESH_TIMEOUT = 5_000;

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  const refreshTokenValue = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (refreshTokenValue) {
    const tokens = await requestTokenRefresh(refreshTokenValue, PROXY_REFRESH_TIMEOUT);

    if (tokens) {
      request.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken);

      const response = NextResponse.next({ request });

      setAuthCookies(response.cookies, tokens);

      return response;
    }
  }

  const redirectResponse = NextResponse.redirect(new URL("/login", request.url));

  clearAuthCookies(redirectResponse.cookies);

  return redirectResponse;
}

export const config = {
  matcher: ["/", "/propensity", "/my/:path*"],
};
