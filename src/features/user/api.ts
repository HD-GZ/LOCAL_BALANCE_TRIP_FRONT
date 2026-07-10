import type {
  EmailAvailabilityRequest,
  EmailAvailabilityResponse,
  MeResponse,
} from "@/features/user/types";
import { apiClient } from "@/lib/api";
import { localApiGet } from "@/lib/api/local-client";

export function checkEmailAvailability({ email }: EmailAvailabilityRequest) {
  return apiClient.get<EmailAvailabilityResponse>("/users/email-availability", {
    params: {
      email,
    },
  });
}

export async function getMe() {
  return localApiGet<MeResponse>("/api/auth/me");
}
