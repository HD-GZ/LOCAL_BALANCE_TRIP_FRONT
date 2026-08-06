import type {
  EmailAvailabilityRequest,
  EmailAvailabilityResponse,
  MeResponse,
  UserUpdateRequest,
} from "@/features/user/types";
import { apiClient } from "@/lib/api/client";

export function checkEmailAvailability({ email }: EmailAvailabilityRequest) {
  return apiClient.get<EmailAvailabilityResponse>("/api/users/email-availability", {
    params: {
      email,
    },
  });
}

export async function getMe() {
  return apiClient.get<MeResponse>("/api/auth/me");
}

export function updateMe(body: UserUpdateRequest) {
  return apiClient.patch<MeResponse, UserUpdateRequest>("/api/auth/me", { body });
}

export function withdrawMe() {
  return apiClient.delete<null>("/api/auth/me");
}
