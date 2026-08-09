import { queryOptions } from "@tanstack/react-query";
import {
  getHomeHero,
  getHomeIncentives,
  getHomePopularCourses,
  getHomeProfileSummary,
  getHomeProfileTypes,
  getHomeSavedCourses,
} from "@/features/home/api";

export const homeQueryKeys = {
  all: ["home"] as const,
  hero: () => [...homeQueryKeys.all, "hero"] as const,
  profileTypes: () => [...homeQueryKeys.all, "profile-types"] as const,
  profileSummary: () => [...homeQueryKeys.all, "profile-summary"] as const,
  popularCourses: () => [...homeQueryKeys.all, "popular-courses"] as const,
  incentives: () => [...homeQueryKeys.all, "incentives"] as const,
  savedCourses: () => [...homeQueryKeys.all, "saved-courses"] as const,
};

export const homeQueries = {
  hero: () =>
    queryOptions({
      queryKey: homeQueryKeys.hero(),
      queryFn: getHomeHero,
    }),
  profileTypes: (enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.profileTypes(),
      queryFn: getHomeProfileTypes,
    }),
  /** 미진단 사용자는 404를 반환하므로 재시도하지 않는다. */
  profileSummary: (enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.profileSummary(),
      queryFn: getHomeProfileSummary,
      retry: false,
    }),
  popularCourses: (enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.popularCourses(),
      queryFn: getHomePopularCourses,
    }),
  incentives: () =>
    queryOptions({
      queryKey: homeQueryKeys.incentives(),
      queryFn: getHomeIncentives,
    }),
  savedCourses: (enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.savedCourses(),
      queryFn: getHomeSavedCourses,
    }),
};
