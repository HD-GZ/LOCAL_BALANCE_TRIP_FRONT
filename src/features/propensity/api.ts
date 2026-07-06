import { localApiPost } from "@/lib/api/local-client";
import type { PropensityResponse, PropensityRequest } from "./types";

export async function postPropensity(body: PropensityRequest) {
  return localApiPost<PropensityResponse, PropensityRequest>("/api/propensity", body);
}
