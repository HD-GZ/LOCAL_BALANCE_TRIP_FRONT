import type {
  AuthToken,
  AuthUserResponse,
  EmailVerificationConfirmRequest,
  EmailVerificationPendingResponse,
  EmailVerificationResendRequest,
  LoginRequest,
  SignupRequest,
  TokenRefreshRequest,
} from "@/features/auth/types";
import { apiClient } from "@/lib/api";
import { localApiPost } from "@/lib/api/local-client";

export function login(body: LoginRequest) {
  return apiClient.post<AuthToken, LoginRequest>("/auth/login", {
    body,
  });
}

export function signup(body: SignupRequest) {
  return apiClient.post<EmailVerificationPendingResponse, SignupRequest>("/auth/signup", {
    body,
  });
}

export function refreshToken(body: TokenRefreshRequest) {
  return apiClient.post<AuthToken, TokenRefreshRequest>("/auth/refresh", {
    body,
  });
}

export function logout() {
  return localApiPost<null>("/api/auth/logout");
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
  return apiClient.post<EmailVerificationPendingResponse, EmailVerificationResendRequest>(
    "/auth/email-verifications/resend",
    {
      body,
    },
  );
}
