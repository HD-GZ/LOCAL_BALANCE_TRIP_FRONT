import type {
  EmailAvailabilityRequest,
  EmailAvailabilityResponse,
} from "@/features/user/types";
import { apiClient } from "@/lib/api";

export function checkEmailAvailability({ email }: EmailAvailabilityRequest) {
  return apiClient.get<EmailAvailabilityResponse>("/users/email-availability", {
    params: {
      email,
    },
  });
}
