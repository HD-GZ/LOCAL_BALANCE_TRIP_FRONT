import { apiClient } from "@/lib/api/client";
import type { ShareTokenResponse } from "./types";

export async function createShareToken(savedCourseId: number) {
  return apiClient.post<ShareTokenResponse>(`/api/saved-courses/${savedCourseId}/share-tokens`);
}
