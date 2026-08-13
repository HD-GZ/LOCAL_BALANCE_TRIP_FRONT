import { apiClient } from "@/lib/api/client";
import type { CourseReportResponse } from "./types";

export async function getReports(savedCourseId: number) {
  return await apiClient.get<CourseReportResponse>(`/api/saved-courses/${savedCourseId}/reports`);
}
