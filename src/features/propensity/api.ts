import { apiClient } from "@/lib/api/client";
import type { PropensityResponse, PropensityRequest } from "./types";

export async function getPropensity() {
  return apiClient.get<PropensityResponse>("/api/propensity");
}

export async function postPropensity(body: PropensityRequest) {
  return apiClient.post<PropensityResponse, PropensityRequest>("/api/propensity", { body });
}
