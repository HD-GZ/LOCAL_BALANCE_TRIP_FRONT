import { queryOptions } from "@tanstack/react-query";
import {
  getHomeHero,
  getHomeIncentives,
  getHomePopularCourseDetail,
  getHomePopularCourses,
  getHomeProfileSummary,
  getHomeProfileTypes,
  getHomeSavedCourses,
} from "@/features/home/api";

export const homeQueryKeys = {
  all: ["home"] as const,
  hero: (locale: string) => [...homeQueryKeys.all, locale, "hero"] as const,
  profileTypes: (locale: string) => [...homeQueryKeys.all, locale, "profile-types"] as const,
  profileSummary: (locale: string) => [...homeQueryKeys.all, locale, "profile-summary"] as const,
  popularCourses: (locale: string) => [...homeQueryKeys.all, locale, "popular-courses"] as const,
  popularCourseDetail: (locale: string, courseId: number) =>
    [...homeQueryKeys.all, locale, "popular-courses", courseId] as const,
  incentives: (locale: string) => [...homeQueryKeys.all, locale, "incentives"] as const,
  savedCourses: (locale: string) => [...homeQueryKeys.all, locale, "saved-courses"] as const,
};

export const homeQueries = {
  hero: (locale: string) =>
    queryOptions({
      queryKey: homeQueryKeys.hero(locale),
      queryFn: getHomeHero,
    }),
  profileTypes: (locale: string, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.profileTypes(locale),
      queryFn: getHomeProfileTypes,
    }),
  profileSummary: (locale: string, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.profileSummary(locale),
      queryFn: getHomeProfileSummary,
      retry: false,
    }),
  popularCourses: (locale: string, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.popularCourses(locale),
      queryFn: getHomePopularCourses,
    }),
  popularCourseDetail: (locale: string, courseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.popularCourseDetail(locale, courseId),
      queryFn: () => getHomePopularCourseDetail(courseId),
    }),
  incentives: (locale: string) =>
    queryOptions({
      queryKey: homeQueryKeys.incentives(locale),
      queryFn: getHomeIncentives,
    }),
  savedCourses: (locale: string, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.savedCourses(locale),
      queryFn: getHomeSavedCourses,
    }),
};
