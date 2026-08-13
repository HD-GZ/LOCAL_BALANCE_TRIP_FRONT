import { isApiResponse } from "@/lib/api/guards";
import { API_BASE_URL } from "@/lib/config/server";
import type { SharedCourseResponse } from "./types";

export type SharedCourseResult =
  | { status: "found"; course: SharedCourseResponse }
  | { status: "not_found" }
  | { status: "expired" };

export async function getSharedCourse(token: string): Promise<SharedCourseResult> {
  const response = await fetch(new URL(`/shared-courses/${token}`, API_BASE_URL), {
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (response.status === 410) {
    return { status: "expired" };
  }

  if (!isApiResponse(payload) || payload.result === "ERROR") {
    return { status: "not_found" };
  }

  return { status: "found", course: payload.data as SharedCourseResponse };
}
