import { queryOptions } from "@tanstack/react-query";
import {
  getCourseDetail,
  getRecommendedRegions,
  getRegionCourses,
  getSavedCourses,
  getSavedCoursesDetail,
} from "@/features/recommendation/api";
import type { SavedCourse } from "@/features/recommendation/types";

export const recommendationQueryKeys = {
  all: ["recommendation"] as const,
  regions: () => [...recommendationQueryKeys.all, "regions"] as const,
  regionCourses: (regionId: number) =>
    [...recommendationQueryKeys.all, "regions", regionId, "courses"] as const,
  courseDetail: (courseId: number) =>
    [...recommendationQueryKeys.all, "courses", courseId] as const,
  savedCoursesAll: () => [...recommendationQueryKeys.all, "saved-courses"] as const,
  savedCourses: (page?: number, limit?: number, status?: SavedCourse["status"]) =>
    [...recommendationQueryKeys.savedCoursesAll(), page, limit, status] as const,
  savedCoursesDetail: (savedCourseId: number) =>
    [...recommendationQueryKeys.savedCoursesAll(), savedCourseId] as const,
};

export const recommendationQueries = {
  regions: () =>
    queryOptions({
      queryKey: recommendationQueryKeys.regions(),
      queryFn: getRecommendedRegions,
    }),
  regionCourses: (regionId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: recommendationQueryKeys.regionCourses(regionId),
      queryFn: () => getRegionCourses(regionId),
    }),
  courseDetail: (courseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: recommendationQueryKeys.courseDetail(courseId),
      queryFn: () => getCourseDetail(courseId),
    }),
  savedCourses: (page?: number, limit?: number, status?: SavedCourse["status"]) =>
    queryOptions({
      queryKey: recommendationQueryKeys.savedCourses(page, limit, status),
      queryFn: () => getSavedCourses(page, limit, status),
    }),
  savedCoursesDetail: (savedCourseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: recommendationQueryKeys.savedCoursesDetail(savedCourseId),
      queryFn: () => getSavedCoursesDetail(savedCourseId),
    }),
};
