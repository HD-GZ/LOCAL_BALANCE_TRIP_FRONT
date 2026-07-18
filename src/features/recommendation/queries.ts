import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import {
  getCourseDetail,
  getRecommendedRegions,
  getRegionCourses,
  postRecommendations,
  saveCourse,
} from "@/features/recommendation/api";

export const recommendationQueryKeys = {
  all: ["recommendation"] as const,
  regions: () => [...recommendationQueryKeys.all, "regions"] as const,
  regionCourses: (regionId: number) =>
    [...recommendationQueryKeys.all, "regions", regionId, "courses"] as const,
  courseDetail: (courseId: number) =>
    [...recommendationQueryKeys.all, "courses", courseId] as const,
};

export const recommendationQueries = {
  regions: () =>
    queryOptions({
      queryKey: recommendationQueryKeys.regions(),
      queryFn: getRecommendedRegions,
    }),
  regionCourses: (regionId: number) =>
    queryOptions({
      queryKey: recommendationQueryKeys.regionCourses(regionId),
      queryFn: () => getRegionCourses(regionId),
    }),
  courseDetail: (courseId: number) =>
    queryOptions({
      queryKey: recommendationQueryKeys.courseDetail(courseId),
      queryFn: () => getCourseDetail(courseId),
    }),
};

export function useGetRecommendedRegionsQuery() {
  return useQuery(recommendationQueries.regions());
}

export function useGetRegionCoursesQuery(regionId: number) {
  return useQuery(recommendationQueries.regionCourses(regionId));
}

export function useGetCourseDetailQuery(courseId: number) {
  return useQuery(recommendationQueries.courseDetail(courseId));
}

export function usePostRecommendationsMutation() {
  return useMutation({
    mutationFn: postRecommendations,
  });
}

export function useSaveCourseMutation() {
  return useMutation({
    mutationFn: saveCourse,
  });
}
