import type { PolicyDocumentResponse, PolicyDocumentType } from "@/features/policy/types";
import { apiClient } from "@/lib/api/client";

export function getPolicyDocument(type: PolicyDocumentType) {
  return apiClient.get<PolicyDocumentResponse>(`/api/terms/${type}`);
}
