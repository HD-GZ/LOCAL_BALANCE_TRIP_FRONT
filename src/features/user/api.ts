import type {
  EmailAvailabilityRequest,
  EmailAvailabilityResponse,
  MeResponse,
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
