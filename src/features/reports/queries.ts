import { queryOptions } from "@tanstack/react-query";
import { getReports } from "./api";

export const reportsQueryKeys = {
  all: ["reports"] as const,
  reports: (savedCourseId: number) => [...reportsQueryKeys.all, savedCourseId] as const,
}

export const ReportQueries = (savedCourseId: number) => ({
  report: () =>
    queryOptions({
      queryKey: reportsQueryKeys.reports(savedCourseId),
      queryFn: () => getReports(savedCourseId),
    }),
});