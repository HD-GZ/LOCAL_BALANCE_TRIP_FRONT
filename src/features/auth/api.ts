import type {
  AuthUserResponse,
  EmailVerificationConfirmRequest,
  EmailVerificationPendingResponse,
  EmailVerificationResendRequest,
  SignupRequest,
} from "@/features/auth/types";
import { apiClient } from "@/lib/api";
import { localApiPost } from "@/lib/api/localClient";

export function signup(body: SignupRequest) {
  return apiClient.post<EmailVerificationPendingResponse, SignupRequest>("/auth/signup", {
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
