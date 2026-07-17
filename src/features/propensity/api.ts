import { localApiGet, localApiPost } from "@/lib/api/localClient";
import type { PropensityResponse, PropensityRequest } from "./types";

export async function getPropensity() {
  return localApiGet<PropensityResponse>("/api/propensity");
}

export async function postPropensity(body: PropensityRequest) {
  return localApiPost<PropensityResponse, PropensityRequest>("/api/propensity", body);
}
