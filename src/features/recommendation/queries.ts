import { queryOptions } from "@tanstack/react-query";
import {
  getCourseDetail,
  getRecommendedRegions,
  getRegionCourses,
  getSavedCourses,
  getSavedCoursesDetail,
} from "@/features/recommendation/api";
import type { SavedCourse } from "@/features/recommendation/types";
import { isApiError } from "@/lib/api/error";

function retryUnlessUnauthorized(failureCount: number, error: unknown) {
  if (isApiError(error) && error.status === 401) {
    return false;
  }

  return failureCount < 3;
}

export const recommendationQueryKeys = {
  all: ["recommendation"] as const,
  regions: (locale: string) => [...recommendationQueryKeys.all, locale, "regions"] as const,
  regionCourses: (locale: string, regionId: number) =>
    [...recommendationQueryKeys.all, locale, "regions", regionId, "courses"] as const,
  courseDetail: (locale: string, courseId: number) =>
    [...recommendationQueryKeys.all, locale, "courses", courseId] as const,
  savedCoursesAll: () => [...recommendationQueryKeys.all, "saved-courses"] as const,
  savedCourses: (
    locale: string,
    page?: number,
    limit?: number,
    status?: SavedCourse["status"],
  ) => [...recommendationQueryKeys.savedCoursesAll(), locale, page, limit, status] as const,
  savedCoursesDetail: (locale: string, savedCourseId: number) =>
    [...recommendationQueryKeys.savedCoursesAll(), locale, savedCourseId] as const,
};

export const recommendationQueries = {
  regions: (locale: string) =>
    queryOptions({
      queryKey: recommendationQueryKeys.regions(locale),
      queryFn: getRecommendedRegions,
      retry: retryUnlessUnauthorized,
    }),
  regionCourses: (locale: string, regionId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: recommendationQueryKeys.regionCourses(locale, regionId),
      queryFn: () => getRegionCourses(regionId),
    }),
  courseDetail: (locale: string, courseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: recommendationQueryKeys.courseDetail(locale, courseId),
      queryFn: () => getCourseDetail(courseId),
    }),
  savedCourses: (locale: string, page?: number, limit?: number, status?: SavedCourse["status"]) =>
    queryOptions({
      queryKey: recommendationQueryKeys.savedCourses(locale, page, limit, status),
      queryFn: () => getSavedCourses(page, limit, status),
    }),
  savedCoursesDetail: (locale: string, savedCourseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: recommendationQueryKeys.savedCoursesDetail(locale, savedCourseId),
      queryFn: () => getSavedCoursesDetail(savedCourseId),
    }),
};
