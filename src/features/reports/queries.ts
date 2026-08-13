import { queryOptions } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/error";
import { getReports } from "./api";

export const reportsQueryKeys = {
  all: ["reports"] as const,
  reports: (savedCourseId: number) => [...reportsQueryKeys.all, savedCourseId] as const,
}

function retryUnlessReportUnavailable(failureCount: number, error: unknown) {
  if (isApiError(error) && (error.status === 401 || error.status === 409)) {
    return false;
  }

  return failureCount < 3;
}

export const ReportQueries = (savedCourseId: number) => ({
  report: () =>
    queryOptions({
      queryKey: reportsQueryKeys.reports(savedCourseId),
      queryFn: () => getReports(savedCourseId),
      retry: retryUnlessReportUnavailable,
    }),
});