import type { AuthToken, TokenRefreshRequest } from "@/features/auth/types";
import { isApiResponse } from "@/lib/api/guards";
import { authTokenSchema } from "@/lib/auth/schema";
import { API_BASE_URL } from "@/lib/config/server";

export async function requestTokenRefresh(
  refreshTokenValue: string,
  timeout = 10_000,
): Promise<AuthToken | null> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  let response: Response;

  try {
    response = await fetch(new URL("/auth/refresh", API_BASE_URL), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue } satisfies TokenRefreshRequest),
      cache: "no-store",
      signal: abortController.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!isApiResponse(payload) || payload.result === "ERROR" || !response.ok) {
    return null;
  }

  const token = authTokenSchema.safeParse(payload.data);
  return token.success ? (token.data as AuthToken) : null;
}
