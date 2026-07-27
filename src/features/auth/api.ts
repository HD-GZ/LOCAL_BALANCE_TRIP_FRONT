import type {
  AuthUserResponse,
  EmailVerificationConfirmRequest,
  EmailVerificationPendingResponse,
  EmailVerificationResendRequest,
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
