import type {
  HeroResponse,
  HomeFeedResponse,
  IncentivesResponse,
  PopularCoursesResponse,
  ProfileSummaryResponse,
  ProfileTypesResponse,
} from "@/features/home/types";
import type { CourseDetailResponse } from "@/features/recommendation/types";
import { apiClient } from "@/lib/api/client";

export function getHomeHero() {
  return apiClient.get<HeroResponse>("/api/home/hero");
}

export function getHomeProfileTypes() {
  return apiClient.get<ProfileTypesResponse>("/api/home/profile-types");
}

export function getHomeProfileSummary() {
  return apiClient.get<ProfileSummaryResponse>("/api/home/profile-summary");
}

export function getHomePopularCourses() {
  return apiClient.get<PopularCoursesResponse>("/api/home/popular-courses");
}

export function getHomePopularCourseDetail(courseId: number) {
  return apiClient.get<CourseDetailResponse>(`/api/home/popular-courses/${courseId}`);
}

export function getHomeIncentives() {
  return apiClient.get<IncentivesResponse>("/api/home/incentives");
}

export function getHomeSavedCourses() {
  return apiClient.get<HomeFeedResponse>("/api/home/saved-courses");
}
