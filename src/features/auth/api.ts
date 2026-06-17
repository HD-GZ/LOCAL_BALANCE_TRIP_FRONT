import type {
  AuthToken,
  AuthUserResponse,
  EmailVerificationConfirmRequest,
  EmailVerificationResendRequest,
  LoginRequest,
  SignupRequest,
  TokenRefreshRequest,
} from "@/features/auth/types";
import { apiClient } from "@/lib/api";

export function login(body: LoginRequest) {
  return apiClient.post<AuthToken, LoginRequest>("/auth/login", {
    body,
  });
}

export function signup(body: SignupRequest) {
  return apiClient.post<AuthUserResponse, SignupRequest>("/auth/signup", {
    body,
  });
}

export function refreshToken(body: TokenRefreshRequest) {
  return apiClient.post<AuthToken, TokenRefreshRequest>("/auth/refresh", {
    body,
  });
}

export function logout(accessToken: string) {
  return apiClient.post<null>("/auth/logout", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function confirmEmailVerification(body: EmailVerificationConfirmRequest) {
  return apiClient.post<AuthUserResponse, EmailVerificationConfirmRequest>(
    "/auth/email-verifications/confirm",
    {
      body,
    },
  );
}

export function resendEmailVerification(body: EmailVerificationResendRequest) {
  return apiClient.post<AuthUserResponse, EmailVerificationResendRequest>(
    "/auth/email-verifications/resend",
    {
      body,
    },
  );
}
