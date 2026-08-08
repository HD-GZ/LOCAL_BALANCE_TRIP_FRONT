import type {
  AuthUserResponse,
  EmailVerificationConfirmRequest,
  EmailVerificationPendingResponse,
  EmailVerificationResendRequest,
  PasswordResetCodeRequest,
  PasswordResetCodeResponse,
  PasswordResetConfirmRequest,
  PasswordResetConfirmResponse,
  PasswordResetRequest,
  SignupRequest,
} from "@/features/auth/types";
import { apiClient } from "@/lib/api/client";

export function signup(body: SignupRequest) {
  return apiClient.post<EmailVerificationPendingResponse, SignupRequest>("/api/auth/signup", {
    body,
  });
}

export function logout() {
  return apiClient.post<null>("/api/auth/logout");
}

export function confirmEmailVerification(body: EmailVerificationConfirmRequest) {
  return apiClient.post<AuthUserResponse, EmailVerificationConfirmRequest>(
    "/api/auth/email-verifications/confirm",
    {
      body,
    },
  );
}

export function resendEmailVerification(body: EmailVerificationResendRequest) {
  return apiClient.post<EmailVerificationPendingResponse, EmailVerificationResendRequest>(
    "/api/auth/email-verifications/resend",
    {
      body,
    },
  );
}

export function requestPasswordResetCode(body: PasswordResetCodeRequest) {
  return apiClient.post<PasswordResetCodeResponse, PasswordResetCodeRequest>(
    "/api/auth/password-reset/request",
    {
      body,
    },
  );
}

export function confirmPasswordResetCode(body: PasswordResetConfirmRequest) {
  return apiClient.post<PasswordResetConfirmResponse, PasswordResetConfirmRequest>(
    "/api/auth/password-reset/confirm",
    {
      body,
    },
  );
}

export function resetPassword(body: PasswordResetRequest) {
  return apiClient.post<null, PasswordResetRequest>("/api/auth/password-reset", {
    body,
  });
}
