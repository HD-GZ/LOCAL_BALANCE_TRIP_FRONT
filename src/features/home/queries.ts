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
import type { Locale } from "next-intl";

export const homeQueryKeys = {
  all: ["home"] as const,
  hero: (locale: Locale) => [...homeQueryKeys.all, locale, "hero"] as const,
  profileTypes: (locale: Locale) => [...homeQueryKeys.all, locale, "profile-types"] as const,
  profileSummary: (locale: Locale) => [...homeQueryKeys.all, locale, "profile-summary"] as const,
  popularCourses: (locale: Locale) => [...homeQueryKeys.all, locale, "popular-courses"] as const,
  popularCourseDetail: (locale: Locale, courseId: number) =>
    [...homeQueryKeys.all, locale, "popular-courses", courseId] as const,
  incentives: (locale: Locale) => [...homeQueryKeys.all, locale, "incentives"] as const,
  savedCourses: (locale: Locale) => [...homeQueryKeys.all, locale, "saved-courses"] as const,
};

export const homeQueries = {
  hero: (locale: Locale) =>
    queryOptions({
      queryKey: homeQueryKeys.hero(locale),
      queryFn: getHomeHero,
    }),
  profileTypes: (locale: Locale, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.profileTypes(locale),
      queryFn: getHomeProfileTypes,
    }),
  profileSummary: (locale: Locale, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.profileSummary(locale),
      queryFn: getHomeProfileSummary,
      retry: false,
    }),
  popularCourses: (locale: Locale, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.popularCourses(locale),
      queryFn: getHomePopularCourses,
    }),
  popularCourseDetail: (locale: Locale, courseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.popularCourseDetail(locale, courseId),
      queryFn: () => getHomePopularCourseDetail(courseId),
    }),
  incentives: (locale: Locale) =>
    queryOptions({
      queryKey: homeQueryKeys.incentives(locale),
      queryFn: getHomeIncentives,
    }),
  savedCourses: (locale: Locale, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: homeQueryKeys.savedCourses(locale),
      queryFn: getHomeSavedCourses,
    }),
};
