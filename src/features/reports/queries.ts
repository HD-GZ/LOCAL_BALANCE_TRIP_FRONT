import { queryOptions } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/error";
import { getReports } from "./api";
import type { Locale } from "next-intl";

export const reportsQueryKeys = {
  all: ["reports"] as const,
  reports: (locale: Locale, savedCourseId: number) =>
    [...reportsQueryKeys.all, locale, savedCourseId] as const,
}

function retryUnlessReportUnavailable(failureCount: number, error: unknown) {
  if (isApiError(error) && (error.status === 401 || error.status === 409)) {
    return false;
  }

  return failureCount < 3;
}

export const ReportQueries = (locale: Locale, savedCourseId: number) => ({
  report: () =>
    queryOptions({
      queryKey: reportsQueryKeys.reports(locale, savedCourseId),
      queryFn: () => getReports(savedCourseId),
      retry: retryUnlessReportUnavailable,
    }),
});
