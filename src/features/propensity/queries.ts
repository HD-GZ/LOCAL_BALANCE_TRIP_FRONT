import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getPropensity, postPropensity } from "@/features/propensity/api";

export const propensityQueryKeys = {
  all: ["propensity"] as const,
  result: (locale: string) => [...propensityQueryKeys.all, locale, "result"] as const,
};

export const propensityQueries = {
  result: (locale: string, enabled: boolean) =>
    queryOptions({
      enabled,
      queryKey: propensityQueryKeys.result(locale),
      queryFn: getPropensity,
      retry: false,
    }),
};

export function useGetPropensityResultQuery(enabled: boolean) {
  const locale = useLocale();

  return useQuery(propensityQueries.result(locale, enabled));
}

export function usePostPropensityMutation() {
  return useMutation({
    mutationFn: postPropensity,
  });
}
