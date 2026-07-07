import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getPropensity, postPropensity } from "@/features/propensity/api";

export const propensityQueryKeys = {
  all: ["propensity"] as const,
  result: () => [...propensityQueryKeys.all, "result"] as const,
};

export const propensityQueries = {
  result: (enabled: boolean) =>
    queryOptions({
      enabled,
      queryKey: propensityQueryKeys.result(),
      queryFn: getPropensity,
      retry: false,
    }),
};

export function useGetPropensityResultQuery(enabled: boolean) {
  return useQuery(propensityQueries.result(enabled));
}

export function usePostPropensityMutation() {
  return useMutation({
    mutationFn: postPropensity,
  });
}
