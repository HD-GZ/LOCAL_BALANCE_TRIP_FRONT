import { RECOMMENDATION_GENERATION_TIMEOUT } from "@/features/recommendation/constants";
import { apiClient } from "@/lib/api/client";
import type {
  CourseDetailResponse,
  RecommendedCourse,
  RecommendedRegion,
  SavedCourseResponse,
} from "./types";

export async function postRecommendations() {
  return apiClient.post<null>("/api/recommendations", {
    timeout: RECOMMENDATION_GENERATION_TIMEOUT,
  });
}

export async function getRecommendedRegions() {
  return apiClient.get<RecommendedRegion[]>("/api/recommendations/regions");
}

export async function getRegionCourses(regionId: number) {
  return apiClient.get<RecommendedCourse[]>(`/api/recommendations/regions/${regionId}/courses`);
}

export async function getCourseDetail(courseId: number) {
  return apiClient.get<CourseDetailResponse>(`/api/recommendations/courses/${courseId}`);
}

export async function saveCourse(courseId: number) {
  return apiClient.post<null>(`/api/recommendations/courses/${courseId}/save`);
}

export async function getSavedCourses(page?: number, limit?: number) {
  return apiClient.get<SavedCourseResponse>("/api/saved-courses", {
    params: { page, limit },
  });
}
