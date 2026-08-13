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

  if (response.status === 404) {
    return { status: "not_found" };
  }

  if (response.status === 410) {
    return { status: "expired" };
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok || !isApiResponse(payload) || payload.result === "ERROR") {
    throw new Error(`공유 코스를 불러오지 못했습니다. (status: ${response.status})`);
  }

  return { status: "found", course: payload.data as SharedCourseResponse };
}
